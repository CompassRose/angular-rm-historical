import { Component, Input, OnDestroy, ElementRef } from '@angular/core';
import { DashboardFacade } from '../dashboard.facade';
import { QueryItems } from '../models/dashboard.model';
import * as echarts from 'echarts';


// @ts-ignore
declare let document;

@Component({
  selector: 'scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})

export class ScatterChartComponent implements OnDestroy {

  public metricSpecificValues: any[] = [
    { id: 0, name: 'Load Factor', ref: 'Ntile', suffix: '%', min: 0, max: 100, right: 130 },
    { id: 1, name: 'Standardized', ref: 'Region', suffix: '', min: -3, max: 3, right: 215 }
  ];

  public symbolSize = 4;
  public data: any[] = [];
  public targetElement: any;
  public scatterObserver: any;

  public options: any = {};

  public myChart: any = null;
  public selectedRegion: string[] = [];
  public plotType: number = 0;
  public NdoRange: any[] = [];
  public ndoRangeStr: string = '';
  public referenceName: any;
  public selectedNodes: number[] = [];
  public resizeCheck = false;
  public refreshChartValues = false;

  public categorizedValues: any;
  public clusteredValues: any;

  //---------------
  //Cat data
  // Departure,
  // Origin,
  // Destination,
  // flt,
  // Region,
  // Ndo,
  // Lf,
  // Ntile,
  // Norm, 
  // Stand

  //---------------
  // Clustered Data
  // AvgFare:"30.6919"
  // Bookings:"17887"
  // Destination:"SCQ"
  // Distance:"1107"
  // FlightCount:"146"
  // Lat1:"43.43555"
  // Lat2:"42.895"
  // LoadFactor:"0.646720659"
  // Lon1:"5.216389"
  // Lon2:"-8.415"
  // Market:"MRSSCQ"
  // Origin:"MRS"
  // RASM:"0.017930565"
  // Revenue:"548987.3963"
  // RpS:"19.84913574"
  // Slope:"-0.007864685"
  // cluster_Dist:"3"
  // cluster_Geo:"1"
  // cluster_Slope:"5"


  @Input()
  set whichMetricState(index: any) {
    console.log('SCATTER  whichMetricState ', index)
    if (index === 0) {
      setTimeout(() => {
        this.sendForChartValues(this.selectedRegion, this.plotType, this.NdoRange);
      }, 500);

    } else {
      this.destroyChartElements()
    }

  }


  // General idea: 
  //   even tool that Farukh has already build, involves displaying general market analysis:

  //         Two dimensional axis scatter chart with axes as:

  //            KPIs: LoadFactor, AvgFare, RASM, RpS, Slope

  //            and Color as the cluster(cluster_Geo, cluster_Slope, cluster_Dist)

  //   + second part of the visualization might be possible map(using Geo coordinates


  constructor(private host: ElementRef,
    private dashboardFacade: DashboardFacade) {


    this.dashboardFacade.screenSelectedSubject$
      .subscribe((response: number) => {
        //console.log('||||||||||||||||||||  response ', response)

      })

    this.dashboardFacade.getQueryItems()
      .subscribe((response: QueryItems) => {

        if (response) {

          // console.log('Scatter this.selectedRegion ', response)
          this.selectedRegion = response.regions;
          this.plotType = response.plotType;
          this.NdoRange = response.ndoList;
          // console.log('Scatter this.selectedRegion ', this.selectedRegion)

          if (this.myChart) {
            this.dashboardFacade.setBrushSelectedFlights([]);
            setTimeout(() => {
              this.clearBoxSelect();
            }, 0);
          }
          this.getReferenceValues();
          // this.sendForChartValues(this.selectedRegion, this.plotType, this.NdoRange);
        }

      })
  }

  ngOnDestroy(): void {
    // console.log('ngOnDestroy ngOnDestroy ngOnDestroy')
    //this.scatterObserver.unobserve(this.targetElement);
  }


  public onChartInit(e: any) {
    console.log('onChartInit ', e)
    this.targetElement = this.host.nativeElement.querySelector('#scatter-chart');
    // @ts-ignore
    this.scatterObserver = new ResizeObserver(entries => {

      if (this.myChart) {
        this.refreshChartVisual();
      }
    });
    this.scatterObserver.observe(this.targetElement);
  }

  // Sets titles and axis text <wip>
  private getReferenceValues() {
    // console.log('this.metricSpecificValues ', this.metricSpecificValues)
    this.referenceName = this.metricSpecificValues[this.metricSpecificValues.findIndex(val => {

      return val.id === this.plotType
    })];
  }


  public sendForChartValues(regions: any[], plot: number, ndoDayRange: any[]) {
    //console.log('sendForChartValues ', regions)
    if (regions !== undefined) {

      this.initChartElements();

      this.dashboardFacade.getCategoryValues(regions, plot, ndoDayRange)
        .subscribe((message: any[]) => {

          this.data = message;
          if (this.data.length > 0) {
            let values: number[] = [];
            values = this.data.map((elt: any, m) => {
              return Number(elt[1]);
            });
            //console.log('values ', values)
            this.dashboardFacade.setRegionDestinationList();
            this.initializeScatterChart();
          }
        });
    }
  }

  public destroyChartElements() {
    if (this.myChart !== null) {
      this.myChart = null;
    }
    if (echarts.init(document.getElementById('scatter-chart'))) {
      echarts.init(document.getElementById('scatter-chart')).dispose();
    }
  }

  // Sets up Node structure
  initChartElements() {

    if (this.myChart !== null) {
      this.myChart = null;
    }
    if (echarts.init(document.getElementById('scatter-chart'))) {
      echarts.init(document.getElementById('scatter-chart')).dispose();
    }

    const chart: HTMLCanvasElement = document.getElementById('scatter-chart') as HTMLCanvasElement;
    this.myChart = echarts.init(chart, 'light');

    if (this.myChart) {
      this.myChart.showLoading({
        text: `   Loading...`,
        color: '#fff',
        textColor: '#ccc',
        showSpinner: true,
        fontSize: 18,
        spinnerRadius: 20,
        maskColor: '#00051c',
        zlevel: 0,
      });
    }
  }

  // Initialise chart in piece wise manner
  public initializeScatterChart() {

    const COLOR_ALL = ['#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'];

    let pieceType: number;
    let basis: any;
    let pieces: any[] = [];

    if (this.plotType === 0) {
      pieceType = 5;
      basis = Array.from([1, 2, 3, 4, 5])
    } else {
      pieceType = this.selectedRegion.length;
      basis = this.selectedRegion
    }

    for (var i = 0; i < pieceType; i++) {
      pieces.push({
        value: (i + 1),
        label: `${basis[i]} `,
        color: COLOR_ALL[i]
      });
    }


    // Identify and update selected scatter elements
    this.myChart.on('brushSelected', (params: any) => {
      const brushComponent = params.batch[0];

      if (!this.resizeCheck) {
        if (this.selectedNodes.length !== brushComponent.selected[0].dataIndex.length) {
          this.selectedNodes = brushComponent.selected[0].dataIndex;
        }
        if (this.selectedNodes.length > 0) {
          this.dashboardFacade.setBrushSelectedFlights(this.selectedNodes);
        } else {
          this.dashboardFacade.setBrushSelectedFlights([]);
        }
      }
      this.resizeCheck = false;
    });

    this.myChart.on('finished', () => {
      setTimeout(() => {
        console.log('*****  Finished Drawing Scatter Chart')
      }, 0);
    })

    // console.log('this.referenceName ', this.referenceName)

    this.myChart.setOption({
      animation: false,
      backgroundColor: '#00051c',
      colors: COLOR_ALL,
      title: {
        text: `Data Categorization:   ${this.referenceName.name} - ${this.referenceName.ref}\nRegion(s): ${this.selectedRegion} - Records: ${this.data.length}\n${this.ndoRangeStr}`,
        textStyle: {
          color: 'LightYellow',
          fontSize: 17,
          fontWeight: 'normal',
          lineHeight: 25
        },
        padding: [16, 0, 20, 35],
      },
      grid: {
        left: 65,
        right: 220,
        bottom: 55,
        top: 85,
        containLabel: true
      },
      progressive: 1000,
      visualMap: {
        type: 'piecewise',
        top: '40%',
        right: 10,
        orient: 'vertical',
        min: 1,
        max: 5,
        dimension: 2,
        pieces: pieces,
        textStyle: {
          color: 'LemonChiffon',
        }
      },
      tooltip: {
        position: 'top',
        appendToBody: true,
        confine: false,
        borderWidth: 2,
        padding: [5, 10],
        extraCssText: 'box-shadow: 0 2px 6px rgba(0, 0, 0, 0.85);',
        textStyle: {
          fontSize: 12,
          color: 'black'
        },
        formatter: (params: any) => {
          // console.log('params ', params, '\nselectedRegion ', this.selectedRegion)
          return `${this.referenceName.name}: ${params.value[1]} ${this.referenceName.suffix} <br/>Region: ${this.selectedRegion[(params.value[2] - 1)]}<br/ > NDO: ${params.value[0]} <br/>Flight: ${params.value[3]}<br/ > Date: ${params.value[4]} `
        },
        axisPointer: {
          show: true,
          type: 'cross',
        }
      },
      toolbox: {
        right: 55,
        top: 10,
        itemSize: 15,
        language: 'en',
        showTitle: true,
        iconStyle: {
          borderColor: 'LemonChiffon',
          borderWidth: 1,
        },

        feature: {
          brush: {
            type: ['rect', 'keep', 'clear'],
          },
          dataZoom: {
            filterMode: 'filtered',
            emphasis: {
              iconStyle: {
                textFill: '#000',
                textBackgroundColor: '#fff',
                textPadding: 5
              }
            },
          },
        }
      },
      brush: {
        icon: 'rect',
        xAxisIndex: 'all',
        brushLink: 'all',
        throttleType: 'debounce',
        throttleDelay: 600,
        removeOnClick: false,
        inBrush: {
          opacity: 1,
          symbolSize: 7,
        },
        outOfBrush: {
          opacity: 0.5,
          symbolSize: this.symbolSize
        }
      },
      xAxis: {
        show: true,
        type: 'value',
        minInterval: 1,
        maxInterval: 5,
        position: 'bottom',
        scale: true,
        axisLabel: {
          formatter: '{value}',
          color: 'white',
        },
        axisLine: {
          show: true,
          onZero: false,
          linestyle: {
            width: 2,
            color: 'rgb(255, 255, 255)',
            opacity: 1
          },
        },

        minorTick: {
          show: true,
        },
        axisTick: {
          show: true,
          length: 15,

          linestyle: {
            width: 2,
            opacity: 1,
            color: 'rgb(255, 255, 255)',
          }
        },

        nameGap: 60,
        name: 'NDO',
        nameLocation: 'end',
        nameTextStyle: {
          color: 'white'
        },
        splitLine: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          min: this.referenceName.min,
          max: this.referenceName.max + 8,
          nameGap: 35,
          minInterval: 1,
          name: this.referenceName.name,
          nameLocation: 'middle',
          axisLabel: {
            formatter: '{value}',
            color: 'white',
          },
          nameTextStyle: {
            color: 'white'
          },
          minorTick: {
            show: true,
          },
          axisTick: {
            show: true,
            length: 10,

            linestyle: {
              width: 2,
              opacity: 1,
              color: 'rgb(255, 255, 255)',
            }
          },
          splitLine: {
            show: false
          }
        },

        {
          show: true,
          type: 'value',
          min: 0,
          nameGap: 60,
          nameLocation: 'middle',
          position: 'right',
          name: this.referenceName.ref,
          nameTextStyle: {
            color: 'white'
          },
          axisTick: {
            show: false,
            length: 10,
            linestyle: {
              width: 2,
              color: 'white',
            }
          },
          axisLabel: {
            show: false,
            formatter: '{value}',
            fontSize: 11,
            fontColor: 'white'
          }
        }

      ],
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 35,
          filterMode: 'none',
        }, {
          type: 'inside'
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          width: 30,
          right: 175,
          start: 0,
          end: 40,
          //brushSelect: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
          showDetail: true,
        }],
      series: [
        {
          name: 'Scatter',
          emphasis: {
            itemStyle: {
              width: 0,
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: 12
            }
          },
          type: 'scatter',
          symbol: 'circle',
          symbolSize: this.symbolSize,
          data: this.data,

        }
      ]
    })

    window.addEventListener('resize', this.refreshChartVisual);

    setTimeout(() => {
      this.myChart.hideLoading();
    }, 200);

  }

  public refreshChartVisual = () => {
    this.resizeCheck = true;
    this.myChart.resize();
  }

  public clearChartSelections() {
    this.myChart.dispatchAction({
      type: 'brush',
      command: 'clear',
      areas: [],
    });
  }



  public clearBoxSelect() {
    this.myChart.dispatchAction({
      type: 'brush',
      command: 'clear',
      areas: []
    });
    this.myChart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'brush',
      brushOption: {
        brushType: false,
        brushMode: 'single'
      }
    })
  }


  releaseClobalCursor() {

    this.myChart.setOption({

      toolbox: {
        right: 45,
        top: 10,
        itemSize: 15,
        language: 'en',
        showTitle: true,
        iconStyle: {
          normal: {
            borderColor: '#fff'
          },
          emphasis: {
            textFill: '#000',
            textBackgroundColor: '#fff',
            textPadding: 5
          }
        },
        feature: {
          brush: {
            type: ['rect', 'keep', 'clear'],
          },
          dataZoom: {
            filterMode: 'filtered',
            emphasis: {
              iconStyle: {
                textFill: '#000',
                textBackgroundColor: '#fff',
                textPadding: 5
              }
            },
          },
        }
      },
      brush: {
        icon: 'rect',
        xAxisIndex: 'all',
        brushLink: 'all',
        throttleType: 'debounce',//Call the callback delay after enabling the selected delay
        throttleDelay: 600,
        removeOnClick: false,
        inBrush: {
          opacity: 1,
          symbolSize: 7,
        },
        outOfBrush: {
          opacity: 0.3,
          symbolSize: this.symbolSize
        }
      }
    })
  }

  // Removes and installs node structure for chat
}