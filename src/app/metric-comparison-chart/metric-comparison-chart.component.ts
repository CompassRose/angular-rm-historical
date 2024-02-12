import { Component, OnChanges, Input, OnDestroy, ElementRef, AfterViewInit, SimpleChange } from '@angular/core';

//import { DashboardFacade } from '../../dashboard.facade';
import { LineChartObject, SeasonalItems, HistoryData, ColumnValues, ODLocate, QueryItems, QueryMap, TableValues, InventoryValues } from '../models/dashboard.model';
import { BehaviorSubject, Subject, Observable, debounceTime, distinctUntilChanged, tap, map } from 'rxjs';
//import { MetricMapper } from '../services/flight-history-mapper';
import * as moment from 'moment';
import * as echarts from 'echarts';

import { arrowUpPath, lockSymbol, unlockSymbol, activeState } from '../dashboard-constants';
import { DashboardFacade } from '../dashboard.facade';
import { MetricMapper } from '../services/flight-history-mapper';

const flightDataMapper = new MetricMapper();

@Component({
    selector: 'metric-comparison',
    templateUrl: './metric-comparison-chart.component.html',
    styleUrls: ['./metric-comparison-chart.component.scss'],
})

export class MetricComparisonComponent implements OnChanges, AfterViewInit, OnDestroy {

    public targetElement: any;
    public widthObserver: any;

    public myChart1: any = null;
    public myChart2: any = null;
    public myChart3: any = null;

    public chartTheme = 'dark';
    public options: any = {};

    public axisValues: any[] = [['Fare', '€', '', ''], ['Load Factor', '%', 'AVG Fare', '€'], ['Load Factor', '%', 'LAF/BRG', '']];
    public compFareHeaders: any[] = [['FR', 'FR', 'none', 0, '€'], ['EI', 'EI', 'none', 0, '€']];
    public progressionHeaders: any[] = [['Laf', 'LAF', 'roundRect', 1, ''], ['LafPy', 'LAF PY', 'roundRect', 1, ''], ['LoadFactor', 'Load Factor', 'arrowUpPath', 0, '%']];
    public lfFareHeaders: any[] = [['LAF', 'Load Factor', 'none', 0, '%'], ['LAFPY', 'Load Factor PY', 'none', 0, '%'], ['AVF_Fare', 'Avg Fare', 'none', 1, '€'], ['AVF_FarePY', 'Avg Fare PY', 'none', 1, '€']];
    public chartTitles: string[] = ['Competitors Fares', 'Current to Previous Year', 'LAF Progression'];


    // Full Chart data array of objects     
    public lfFareCollection: LineChartObject[] = [];
    public compFareCollection: LineChartObject[] = [];
    public progressionCollection: LineChartObject[] = [];

    // chart connect mechanism
    public connectCharts: boolean[] = [false, false, false];
    public featureIcon: any[] = [unlockSymbol, unlockSymbol, unlockSymbol];
    public dataZoomIcon: boolean[] = [true, true, true];

    public fareClasses: string[] = ['', 'S', 'Q', 'B', 'F', 'L', 'E', 'K', 'V', 'C', 'H', 'A', 'W', 'T', 'M', 'N'];
    public ndoDateCollection: any[] = [];
    public axisViewSelection = false;

    public previousYearDataSubject$ = new Subject<HistoryData[]>();

    public competitiveFareSubject$ = new Subject<any>();

    @Input()
    public themeSelectInput: string = '';

    @Input()
    public axisViewInput = false;


    constructor(private dashboardFacade: DashboardFacade, private host: ElementRef) {

        this.setupEventListeners();

        for (let i = 0; i < 375; i++) {
            const nowPlusOneDay = moment().add(i, 'days');
            this.ndoDateCollection.push({ date: this.getFormattedData(nowPlusOneDay), ndo: i });
        }
    }

    public getFormattedData(date: any) {
        return moment.utc(date).format('MMM-D');
    }


    public getStaticMetricData(): Observable<any[]> {
        return this.previousYearDataSubject$
            .pipe(
                map((items: any[]) => {
                    console.log('getStaticMetricData ', items)
                    return flightDataMapper.convertValuesToMetricModel(items);
                }));
    }

    private setupEventListeners() {

        this.dashboardFacade.getFlightHistory()
            .subscribe((values: any[]) => {
                this.progressionCollection = values[1];
                this.lfFareCollection = values[0];
                this.dashboardFacade.getCompetitiveFareValues()
                    .subscribe((message: any[]) => {
                        this.compFareCollection = message;
                        setTimeout(() => {
                            this.createSvg('metric-comparison');
                        }, 0);
                    })
            });
    }

    public ngAfterViewInit(): void {
        this.targetElement = this.host.nativeElement.querySelector('#metric-comparison');
        // @ts-ignore
        this.widthObserver = new ResizeObserver(entries => {
            if (this.myChart1) {
                this.refreshChartVisual();
            }
        });
        this.widthObserver.observe(this.targetElement);
    }

    public ngOnDestroy(): void {
        this.widthObserver.unobserve(this.targetElement);
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        console.log('ngOnChanges ngOnChanges ', changes)
        if (changes['axisViewInput'] && !changes['axisViewInput'].firstChange) {
            this.axisViewSelection = changes['axisViewInput'].currentValue;
            setTimeout(() => {
                this.createSvg('metric-comparison');
            }, 0);

        } else if (changes['themeSelectInput'] && !changes['themeSelectInput'].firstChange) {
            this.chartTheme = changes['themeSelectInput'].currentValue;
            setTimeout(() => {
                this.createSvg('metric-comparison');
            }, 0);
        }

        setTimeout(() => {
            if (this.connectCharts.includes(true)) {
                this.cycleLockState();
            }
        }, 0);
    }



    // Turn on/off DataZoom Element
    public onClickActiveGroupBtn(id: number, state: any) {

        const applicationsByState: { [key: number]: any[] } = {};

        this[`myChart${id + 1}`].setOption({
            grid: {
                bottom: this.dataZoomIcon[id] ? 60 : 30
            },
            toolbox: {
                feature: {
                    myStateFeature: {
                        icon: activeState,
                        iconStyle: {
                            color: this.dataZoomIcon[id] ? 'black' : 'red'
                        },
                    }
                }
            },
            dataZoom: {
                show: this.dataZoomIcon[id]
            }
        });
    }

    // From external control select (ngOnChange)
    public cycleLockState() {
        this.connectCharts.forEach((d, i) => {
            this[`myChart${i + 1}`].group = d ? 'group1' : null;
            this.updateChartConnectedState(i);
        });
    }

    // Connect/disconnect charts from chart specific lock icon
    public onClickSelectGroupBtn(id: any) {

        echarts.disConnect('group1');

        this.connectCharts.forEach((d, i) => {
            this[`myChart${i + 1}`].group = d ? 'group1' : null;
            this.featureIcon[i] = this.connectCharts[i] ? lockSymbol : unlockSymbol;
        });
        echarts.connect('group1');
        this.updateChartConnectedState(id);
    }

    // Set connect state, icon, icon color
    public updateChartConnectedState(id: any) {
        this[`myChart${id + 1}`].setOption({
            toolbox: {
                feature: {
                    myLockFeature: {
                        icon: this.featureIcon[id],
                        iconStyle: {
                            color: this.connectCharts[id] ? 'red' : 'black'
                        },
                    }
                }
            }
        });
    }

    // Initialize Charts, connect to selector ID, initialize echarts instances
    public createSvg(type: any) {
        const self = this;

        if (echarts.init(document.getElementById('metric-comparison') as HTMLCanvasElement)) {
            echarts.init(document.getElementById('metric-comparison') as HTMLCanvasElement).dispose();
        }
        if (echarts.init(document.getElementById('metric-comparison1') as HTMLCanvasElement)) {
            echarts.init(document.getElementById('metric-comparison1') as HTMLCanvasElement).dispose();
        }
        if (echarts.init(document.getElementById('metric-comparison2') as HTMLCanvasElement)) {
            echarts.init(document.getElementById('metric-comparison2') as HTMLCanvasElement).dispose();
        }

        const chart1: HTMLCanvasElement = document.getElementById('metric-comparison') as HTMLCanvasElement;
        const chart2: HTMLCanvasElement = document.getElementById('metric-comparison1') as HTMLCanvasElement;
        const chart3: HTMLCanvasElement = document.getElementById('metric-comparison2') as HTMLCanvasElement;

        console.log('this.chartTheme ', this.chartTheme)

        this.myChart1 = echarts.init(chart1, this.chartTheme);
        this.myChart2 = echarts.init(chart2, this.chartTheme);
        this.myChart3 = echarts.init(chart3, this.chartTheme);

        this.setForecastChart('myChart1', 'compFare', 0);
        this.setForecastChart('myChart2', 'lfFare', 1);
        this.setForecastChart('myChart3', 'progression', 2);

    }


    // Sets up series data for all charts
    private getProgressionData(metric: any) {

        const self = this;
        const series: any[] = [];
        const legendValues = this[`${metric}Headers`];

        this[`${metric}Collection`].map((item: any, i: any) => {
            let sym;
            if (this[`${metric}Headers`][i][2] === 'arrowUpPath') {
                sym = arrowUpPath;
            } else {
                sym = this[`${metric}Headers`][i][2];
            }
            series.push({
                name: legendValues[i][1],
                type: 'line',
                yAxisIndex: this[`${metric}Headers`][i][3],
                symbol: sym,
                lineStyle: {
                    type: legendValues[i][2],
                    normal: {
                        // color: legendValues[i][1],
                        shadowColor: 'rgba(0, 0, 0, .2)',
                        shadowBlur: 4,
                        shadowOffsetY: 3,
                        shadowOffsetX: 3,
                    },
                },
                symbolSize: (value: any, params: any) => {
                    if (item.value[params.dataIndex][1] !== 0) {
                        return 25;
                    } else {
                        return 1;
                    }
                },
                symbolRotate: (value: any, params: any) => {
                    if (item.value[params.dataIndex][1] === 1) {
                        return 0;
                    } else {
                        return 180;
                    }
                },
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        //color: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    formatter(value: any) {
                        let test
                        if (i === 1 && item.value[value.dataIndex][1] !== 0) {
                            test = self.fareClasses[item.value[value.dataIndex][1]];
                        } else if (i === 0 && item.value[value.dataIndex][1] !== 0) {
                            item.value[value.dataIndex][0];
                        } else {
                            test = '';
                        }
                        return test;
                    },
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,149,202,0.1)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,149,202,0)'
                        }
                        ], false),
                        shadowColor: 'rgba(0,149,202, 0.2)',
                        shadowBlur: 20
                    }
                },
                data: item.value.map((d: any, j: any) => {
                    return d[0];
                })
            });
        });



        // this.refreshChartVisual();

        window.addEventListener('resize', this.refreshChartVisual);
        return series;
    }

    public refreshChartVisual = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
    }


    setForecastChart(type: any, metric: any, idx: any) {

        let iconColor = '#000'
        iconColor = this.chartTheme === 'dark' ? '#fff' : '#000';

        const self = this;
        const myChart = this[`${type}`];
        const legendValues = this[`${metric}Headers`];

        myChart.setOption({
            title: {
                text: this.chartTitles[idx],
                textStyle: {
                    fontSize: 17,
                    fontWeight: 'normal',
                },
                padding: [22, 0, 20, 35],
            },
            grid: {
                left: 45,
                right: 55,
                bottom: 70,
                top: 60,
                containLabel: true
            },
            tooltip: {
                show: true,
                snap: false,
                trigger: 'axis',
                padding: [10, 20, 10, 20],
                backgroundColor: 'rgba(0,0,0,0.8)',
                transitionDuration: 0,
                extraCssText: 'width: auto; white-space: pre-wrap',
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                },
                formatter: (params: any) => {
                    // TODO Set up this way because <br> is adding commas ??? 
                    let line2 = '';
                    let line3 = '';
                    let line4 = '';

                    const line1 = `${params[0].marker}  ${params[0].seriesName}:  ${Math.round(params[0].value)}${self[`${metric}Headers`][0][4]}<br>`;
                    if (params.length > 1) {
                        line2 = `${params[1].marker}  ${params[1].seriesName}:  ${Math.round(params[1].value)}${self[`${metric}Headers`][1][4]}<br>`;
                    }
                    if (params.length > 2) {
                        line3 = `${params[2].marker}  ${params[2].seriesName}:  ${Math.round(params[2].value)}${self[`${metric}Headers`][2][4]}<br>`;
                    }
                    if (params.length > 3) {
                        line4 = `${params[3].marker}  ${params[3].seriesName}:  ${Math.round(params[3].value)}${self[`${metric}Headers`][3][4]}<br>`;
                    }
                    return `NDO:  ${this.axisViewSelection ? this.ndoDateCollection[params[0].dataIndex].date : params[0].dataIndex}<br>${line1}${line2}${line3}${line4}`;
                },
                axisPointer: {
                    type: 'line'
                },
            },
            toolbox: {
                orient: 'horizontal',
                right: 30,
                top: 10,
                itemSize: 15,
                language: 'en',
                showTitle: true,
                iconStyle: {
                    normal: {
                        borderColor: iconColor
                    },
                    emphasis: {
                        textFill: '#000',
                        textBackgroundColor: '#fff',
                        textPadding: 5
                    }
                },
                feature: {
                    dataZoom: {
                        yAxisIndex: false,
                        iconStyle: {
                            borderColor: iconColor
                        },
                    },
                    myLockFeature: {
                        show: true,
                        id: 0,
                        title: 'Connect Chart',
                        icon: this.featureIcon[idx],
                        iconStyle: {
                            color: iconColor
                        },
                        onclick: () => {
                            this.connectCharts[idx] = !this.connectCharts[idx];
                            this.onClickSelectGroupBtn(idx);
                        },
                        emphasis: {
                            iconStyle: {
                                color: 'red'
                            }
                        },
                    },
                    myStateFeature: {
                        show: true,
                        id: 1,
                        title: 'Active State',
                        icon: activeState,
                        iconStyle: {
                            color: iconColor
                        },
                        onclick: () => {
                            this.dataZoomIcon[idx] = !this.dataZoomIcon[idx];
                            this.onClickActiveGroupBtn(idx, this.connectCharts[idx]);
                        },
                        emphasis: {
                            iconStyle: {
                                color: 'red'
                            }
                        },
                    },
                }
            },
            legend: {
                top: 15,
                icon: 'roundRect',
                align: 'auto',
                itemWidth: 18,
                itemHeight: 5,
                textStyle: {
                    fontSize: 13,
                },
                data: legendValues.map((item: any, i: any) => {
                    return item[1];
                }),
            },
            xAxis: [
                {
                    type: 'category',
                    nameGap: 30,
                    name: 'NDO',
                    nameLocation: 'middle',
                    data: self.ndoDateCollection.map((item, i) => {
                        return this.axisViewSelection ? item.date : item.ndo;
                    })
                },
            ],
            yAxis: [
                {
                    show: this[`${metric}Headers`][idx][3] === 0 ? true : false,
                    type: 'value',
                    position: 'left',
                    nameLocation: 'middle',
                    min: 0,
                    nameGap: 40,
                    max: this[`${metric}Collection`].max,
                    name: this.axisValues[idx][0],
                    axisLabel: {
                        formatter: (value: any) => {
                            return `${value}${self[`${metric}Headers`][idx][4]}`;
                        },
                        fontSize: 11
                    }
                },
                {
                    show: true,
                    type: 'value',
                    min: 0,
                    nameGap: 40,
                    nameLocation: 'middle',
                    max: this[`${metric}Collection`].max,
                    position: 'right',
                    name: this.axisValues[idx][2],
                    axisLabel: {
                        formatter: function (value: any) {
                            return `${value}${self.axisValues[idx][3]}`;
                        },
                        fontSize: 11
                    }
                }
            ],
            dataZoom: [{
                show: true,
                start: 0,
                end: 20,
                filterMode: 'none',
            }, {
                type: 'inside'
            }],
            series: this.getProgressionData(metric)
        });
    }
}
