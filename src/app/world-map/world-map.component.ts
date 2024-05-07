import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { DashboardFacade } from '../dashboard.facade';

import { AppConstants } from '../dashboard-constants';
import { loadFactor, nTile } from '../dashboard-constants';
import { ContinousColors } from '../../rampbrewer';
import { ODLocate } from '../models/dashboard.model';

import * as echarts from 'echarts';

// @ts-ignore
import { EChartsOption } from 'echarts';


import 'echarts-gl';


export const zoominSvg = '../../assets/custom-icon.svg';

// @ts-ignore
declare let document;

@Component({
    selector: 'world-map',
    templateUrl: './world-map.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./world-map.component.scss']
})

export class WorldMapComponent implements AfterViewInit, OnInit, OnDestroy {

    public selectedFlightGroups: any[] = [];
    public targetElement: any;
    public widthObserver: any;
    public selectedCoordMap: any = {};
    public color = ['#3ed4ff', '#ffa022', '#a6c84c'];
    public series: any[] = [];
    public airportCodeCollection: ODLocate[] = [];
    public options: any = {};

    // public options: EChartsOption = {
    //     animation: true,
    //     visualMap: {
    //         show: false,
    //         type: 'continuous',
    //         handleSize: '140%',
    //         orient: 'horizontal',
    //         itemWidth: 12,
    //         calculable: true,
    //         min: 0,
    //         max: 100,
    //     },
    //     toolbox: {
    //         show: false,
    //         showTitle: true,
    //         emphasis: {
    //             iconStyle: {
    //                 //color: 'red',
    //                 borderColor: '#000',
    //                 borderWidth: 0,
    //                 borderType: 'solid'
    //             },
    //         },
    //         feature: {
    //             restore: {
    //                 show: true,
    //                 title: 'Restore Min Max'
    //             },
    //             saveAsImage: {
    //                 show: true,
    //                 title: 'Save Image to Local'
    //             }
    //         }
    //     },
    //     tooltip: {
    //         show: true,
    //         position: 'top',
    //         appendToBody: true,
    //         confine: false,
    //     },
    //     calendar: [],
    //     series: []
    // };
    public myChart: any = null;

    public selectedFlights: any[] = [];
    public allPoints: any[] = [];
    public colorCollection = ['#37A2DA', '#cc4827', '#20c94d', '#d71ce0', '#dbe548', '#3a86c9', '#76ef58'];
    // ['#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'];   "#37A2DA", #cc4827", "#20c94d", "#d71ce0", "#dbe548", "#3a86c9", "#76ef58"
    public boundingCorners: any[] = [
        [-170, 70],
        [170, -40]
    ];

    public globalWorldValues: any;
    public showLFValues = true;

    constructor(public dashboardFacade: DashboardFacade, private host: ElementRef) {
        // console.log('zoooom ', zoominSvg)
        this.dashboardFacade.getAirportCodes()
            .subscribe((message: ODLocate[]) => {
                if (message.length > 0) {
                    this.airportCodeCollection = message;
                    // console.log('World Map airportCodeCollection ', this.airportCodeCollection)
                }

            });



        this.dashboardFacade.worldCoordinatesBehaviorSubject$
            .subscribe((worldValues: any) => {
                ///console.log('globalWorldValues ', worldValues)
                this.globalWorldValues = worldValues;
                this.registerWorldMap();
            })



        this.dashboardFacade.getBrushSelectedFlights()

            .subscribe((response: any[]) => {
                // console.log('getBrushSelectedFlights ')
                if (response.length > 0) {
                    this.allPoints = [];
                    this.selectedFlights = response;
                    setTimeout(() => {
                        this.findAirportCodes();
                    }, 100)
                    setTimeout(() => {
                        this.setSelectedZoom();
                    }, 1000)
                } else {
                    // console.log('getBrushSelectedFlights ELSE ')
                    this.selectedFlights = [];
                    this.allPoints = [];
                    this.series = [];
                    this.selectedFlightGroups = [];
                    if (this.myChart !== null) {
                        this.generateChart();
                    }
                    setTimeout(() => {
                        //  this.resetMapVolume();
                    }, 100)
                }
            })
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        //  console.log('ngAfterViewInit ngAfterViewInit ngAfterViewInit ')
        this.targetElement = this.host.nativeElement.querySelector('#world-map');
        // // @ts-ignore
        this.widthObserver = new ResizeObserver(entries => {
            if (this.myChart) {
                this.refreshChartVisual();
            }
        });
        this.widthObserver.observe(this.targetElement);
    }


    public ngOnDestroy(): void {
        this.widthObserver.unobserve(this.targetElement);
    }



    // Sets myChart node structure
    public generateChart() {
        // Must dispose of map to reset world and remove nodes
        if (echarts.init(document.getElementById('world-map'))) {
            echarts.init(document.getElementById('world-map')).dispose();
        }
        const chartDom = document.getElementById('world-map');
        this.myChart = echarts.init(chartDom);

        this.setChartOptions();
    }


    // Resets Map bounding volume to default
    public resetMapVolume() {

        const boundingCoords = [[-180, -90], [180, 90]]
        console.log('resetMapVolume ', boundingCoords)
        this.boundingCorners = [
            [-170, 70],
            [170, -40]
        ];

        if (this.myChart) {
            this.myChart.setOption({
                geo: {
                    boundingCoords: [
                        this.boundingCorners[0],
                        this.boundingCorners[1]
                    ],
                }
            });
        }

    }


    public switchMapMetric() {
        this.showLFValues = !this.showLFValues;
        this.findAirportCodes();
    }


    // Zoom Map to selected flight group bounding volume coords
    public setSelectedZoom() {
        const testMin0: any[] = [];
        const testMax0: any[] = [];

        this.allPoints.forEach((d, i) => {
            if (!testMin0.includes(d.coord[0])) {
                testMin0.push(d.coord[0]);
            }
            if (!testMax0.includes(d.coord[1])) {
                testMax0.push(d.coord[1]);
            }
        });

        const min = Math.min.apply(null, testMin0);
        const max = Math.max.apply(null, testMax0);

        // @ts-ignore
        if ([min, max] !== [Infinity, Infinity]) {

            this.boundingCorners[0] = [Math.min.apply(null, testMin0), Math.min.apply(null, testMax0)];
            this.boundingCorners[1] = [Math.max.apply(null, testMin0), Math.max.apply(null, testMax0)];

            this.myChart.setOption({
                geo: {
                    boundingCoords: [
                        this.boundingCorners[0],
                        this.boundingCorners[1]
                    ],
                }
            });
        }
    }


    // Sets World Map  Boundaries/Values
    public setChartOptions() {

        this.myChart.setOption({
            backgroundColor: '#00051c', //'#100C2A',
            title: {
                text: this.selectedFlights.length > 0 ? `Selected Flights (${this.selectedFlights.length})` : ``,
                textStyle: {
                    fontSize: 17,
                    fontWeight: 'normal',
                    lineHeight: 25,
                    color: '#ccc'
                },
                padding: [16, 0, 20, 35],
            },
            progressive: 1100,
            geo: {
                map: 'world',
                selectedMode: false,
                boundingCoords: [
                    this.boundingCorners[0],
                    this.boundingCorners[1]
                ],
                label: {
                    emphasis: {
                        show: true,
                        color: 'yellow',
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#132937',
                        borderColor: "rgba(19,198,249,0.55)",
                    },
                    emphasis: {
                        areaColor: '#0b1c2d'
                    }
                }
            },

            toolbox: {
                right: 25,
                top: 10,
                itemSize: 20,
                language: 'en',
                showTitle: true,
                feature: {
                    mySwitchMetricFeature: {
                        show: true,
                        id: 1,
                        title: 'Toggle Load Factor',
                        icon: this.selectedFlights.length > 0 ? this.showLFValues ? loadFactor : nTile : null,
                        iconStyle: {
                            color: 'rgba(250,250,250,1)',
                            textFill: 'rgb(255,255,255)',
                        },
                        emphasis: {
                            iconStyle: {
                                textFill: '#000',
                                textBackgroundColor: '#fff',
                                textPadding: 5
                            }
                        },
                        onclick: () => {
                            this.switchMapMetric();
                        },
                    },

                    myEditChartFeature: {
                        show: true,
                        id: 1,
                        title: 'Zoom to Selected',
                        icon: this.selectedFlights.length > 0 ? AppConstants.zoomoutPath : null,
                        iconStyle: {
                            borderColor: 'LightYellow',
                            borderWidth: 2,
                        },
                        emphasis: {
                            iconStyle: {
                                textFill: '#000',
                                textBackgroundColor: '#fff',
                                textPadding: 5
                            }
                        },
                        onclick: () => {
                            this.setSelectedZoom();
                        },
                    },

                    myResetChartFeature: {
                        show: true,
                        id: 2,
                        title: 'Reset Map',
                        icon: AppConstants.zoominPath,
                        iconStyle: {
                            borderColor: 'rgba(250,250,250,0.9)',
                            borderWidth: 2,
                        },
                        emphasis: {
                            iconStyle: {
                                textFill: '#000',
                                textBackgroundColor: '#fff',
                                textPadding: 5
                            }
                        },
                        onclick: () => {
                            if (this.myChart !== null) {
                                this.generateChart();
                            }
                            this.resetMapVolume();
                        },
                    },
                }
            },
            series: this.series,
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: (params: any) => {
                    let tipValues = '';
                    if (params.seriesType !== 'lines') {
                        tipValues = `${params.marker} Airport: ${params.data.name}`
                    }
                    return tipValues;
                },
            }
        });

        setTimeout(() => {
            this.refreshChartVisual();
        }, 0);

        window.addEventListener('resize', this.refreshChartVisual);
    }


    public refreshChartVisual = () => {
        this.myChart.resize();
    }


    // Set Selected flight values from airport.csv
    public findAirportCodes() {

        let odPairCollect: any[] = [];
        let coordCollect: any[] = [];
        this.selectedFlightGroups = [];
        let metricColors: any[][] = [];
        const numArray: any[] = [];
        this.allPoints = [];
        this.series = [];

        this.selectedFlights.forEach((e, j) => {

            let oDpair: any[] = [];
            const origin = this.airportCodeCollection.findIndex(res => res.iata_code === e[5]);
            const destination = this.airportCodeCollection.findIndex(res => res.iata_code === e[6]);
            const flightNum = e[3];
            const flightDate = e[4];
            const section = (e[2] - 1);
            numArray.push(e[1]);
            metricColors.push([this.colorCollection[e[2] - 1]]);
            // console.log('metricColors ', metricColors)
            oDpair.push({ name: this.airportCodeCollection[origin].name })
            oDpair.push({ name: this.airportCodeCollection[destination].name })

            const fromCoord = this.airportCodeCollection[origin].coordinates;
            const toCoord = this.airportCodeCollection[destination].coordinates;

            if (!this.allPoints.some(e => e.name === this.airportCodeCollection[origin].name)) {
                this.allPoints.push({ name: this.airportCodeCollection[origin].name, date: flightDate, section: section, flight: flightNum, coord: fromCoord })
            }
            if (!this.allPoints.some(e => e.name === this.airportCodeCollection[destination].name)) {
                this.allPoints.push({ name: this.airportCodeCollection[destination].name, date: flightDate, section: section, flight: flightNum, coord: toCoord })
            }

            if (fromCoord && toCoord) {
                coordCollect.push([{
                    coord: fromCoord
                }, {
                    coord: toCoord
                }]);
            }
            odPairCollect.push(oDpair)
        })
        const loadFactorNormalValues = this.normalize(numArray);
        this.selectedFlightGroups = ['UK', odPairCollect, coordCollect, metricColors, loadFactorNormalValues];

        this.generateSeries();
    }

    //   linear based normalization
    public normalize(list: any) {
        var minMax = list.reduce((acc: any, value: any) => {
            if (value < acc.min) {
                acc.min = value;
            }
            if (value > acc.max) {
                acc.max = value;
            }
            return acc;
        }, {

            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
        });

        return list.map((value: any) => {
            if (minMax.max === minMax.min) {
                return 1 / list.length
            }
            const diff = minMax.max - minMax.min;
            let normVal = (((value - minMax.min) / diff) * 10)

            if (normVal === 10) {
                normVal = 9;
            }
            return ContinousColors[2].value[Math.round(normVal)];
        });
    }


    public generateSeries() {
        const self = this;
        this.series = [];
        if (this.selectedFlightGroups.length > 0) {
            this.series.push({
                name: this.selectedFlightGroups[0] + ' Flight line',
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6, // Flying speed
                    trailLength: 0.7, // Tail of the flight line
                    color: '#fff', // The color of the flight line
                    symbolSize: 3 // The width of the flight line
                },
                lineStyle: {
                    normal: {
                        color: this.selectedFlightGroups[3][0],
                        width: 0,
                        curveness: 0.2 // The degree of curvature of the flight line
                    }
                },
                data: this.selectedFlightGroups[2]
            }, {
                name: this.selectedFlightGroups[0] + ' Flight line',
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: AppConstants.planePath,
                    symbolSize: 10
                },
                // The bottom line style of the flight line

                lineStyle: {
                    normal: {
                        color: (params: any) => {
                            if (this.selectedFlightGroups[3][params.dataIndex][0]) {
                                return this.showLFValues ? this.selectedFlightGroups[3][params.dataIndex][0] : this.selectedFlightGroups[4][params.dataIndex];
                            }
                        },
                        width: 2,
                        opacity: 0.8,
                        curveness: 0.2
                    }
                },
                data: this.selectedFlightGroups[2]
            }, {
                name: this.selectedFlightGroups[0] + ' series',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: [20, 0],
                        color: '#ccc',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val: any) {
                    return 12;
                },
                itemStyle: {
                    normal: {
                        color: (params: any) => {
                            return 'red';
                        },
                    }
                },
                data: this.allPoints.map((dataItem: any, j) => {
                    // console.log('dataItem ', dataItem)
                    return {
                        name: dataItem.name,
                        flight: dataItem.flight,
                        date: dataItem.date,
                        section: dataItem.section,
                        value: dataItem.coord
                    };
                })
            });


            setTimeout(() => {
                this.setChartOptions();
            }, 500);
        }
    }


    public registerWorldMap() {

        echarts.registerMap('world', this.globalWorldValues);

        this.generateChart();

    }
}