import { Component, Input, Output, EventEmitter, SimpleChange, OnDestroy, ChangeDetectionStrategy, AfterViewInit, ElementRef, OnChanges } from '@angular/core';
import { DashboardFacade } from '../dashboard.facade';

import { AgGridAngular } from 'ag-grid-angular';
//import { ColDef, GridApi, GridOptions } from 'ag-grid-community'; // Column Definition Type Interface
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions } from "@ag-grid-community/all-modules";


import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { IRowNode } from 'ag-grid-community';

declare var document;

export interface PieChartData {
  value: number;
  name: string;
};

@Component({
  selector: 'details-container',
  templateUrl: './details-container.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['./details-container.component.scss'],
})


export class DetailsComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input()
  set plotTypeSelectInput(state: any) {
    // console.log('plotTypeSelectInput ', state)
  }

  public checkboxSelection: true;

  public gridOptions: any = {
    animateRows: true,
    enableCellChangeFlash: false,
    rowSelection: 'multiple',
    suppressRowClickSelection: false,
    rowMultiSelectWithClick: true,
    paginationPageSize: 19,
    pagination: true,
    domLayout: 'autoHeight',
    columnDefs: [
      {


        headerCheckboxSelection: true,
        checkboxSelection: true,
        floatingFilter: false,
        // To only show the checkbox on the first column
        headerCheckboxSelectionFilteredOnly: true,
        suppressMenu: true,
        width: 45,
        // Optional: suppress sizeToFit to keep the checkbox column from resizing
        suppressSizeToFit: false,
      },

      {
        field: "Date",
        suppressSizeToFit: false,
        sortable: true,
        width: 85
      },
      {
        field: "Flight",
        sortable: true,
        cellClass: 'rag-amber',
        width: 60
      },
      {
        field: "Origin",
        sortable: true,
        cellClass: 'my-class',
        width: 65
      },
      {
        headerName: "Dest",
        field: "Destination",
        sortable: true,
        cellClass: 'my-class',
        width: 65
      },
      {
        headerName: "Stand",
        field: "LF",
        colId: "LF",
        sortable: true,
        cellClass: 'my-class',
        width: 60
      }
    ]
  }
  public targetElement: any;
  public widthObserver: any;

  public gridColumnApi: any;
  public gridApi: GridApi;
  public rowData: any[] = [];
  public rowSelection: "single" | "multiple" = "multiple";
  public chartDataCollection: PieChartData[] = [];

  public myChart: echarts.ECharts = null;
  public options: EChartsOption = {};
  public kpiFieldStr: string[] = ['LF', 'Stand'];
  public plotType: number = 0;
  public selRegions: string[] = [];

  public selectedFlights = 0;

  public rowFlightIndexes: any[] = [];

  @Input()
  set detailsOpened(state: boolean) {
    console.log('detailsOpened ', state)
    this.gridApi.selectAll();
  }

  @Output()
  public updateDetailRows: EventEmitter<any> = new EventEmitter();

  constructor(public dashboardFacade: DashboardFacade, private host: ElementRef) {

  }


  public ngAfterViewInit(): void {

    this.dashboardFacade.getBrushSelectedFlights()
      .subscribe((response: any[]) => {

        this.rowFlightIndexes = [];

        if (response.length > 0) {
          // console.log('response ', response)
          response.forEach((d) => {

            this.rowFlightIndexes.push(d[3])
          })
          this.selectedFlights = response.length;
          this.setDataGrid(response);
          this.initializeChartValues();
          this.setHeaderNames();

        } else {
          if (this.myChart) {
            this.selectedFlights = 0;
            this.setDataGrid(0);

            // if (echarts.init(document.getElementById('piece-pie'))) {
            //   this.myChart = null;
            //   echarts.init(document.getElementById('piece-pie')).dispose();
            // }
          }
        }
        // console.log('\n\n onSelectionChanged  rowFlightIndexes   ', this.selectedFlights)

      })

    this.targetElement = this.host.nativeElement.querySelector('#piece-pie');

    // @ts-ignore
    this.widthObserver = new ResizeObserver(entries => {
      if (this.myChart) {
        this.refreshGridData();
        this.refreshChartVisual();
      }
    });

    this.widthObserver.observe(this.targetElement);
  }

  public ngOnDestroy(): void {
    this.widthObserver.unobserve(this.targetElement);
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    //@ts-ignore
    this.plotType = changes.plotTypeSelectInput.currentValue;
    //console.log('changes ', changes)
  }

  firstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }


  onSelectionChanged(event) {

    const selectedRows = this.gridApi.getSelectedRows();
    console.log('\n\n onSelectionChanged  selectedRows ', selectedRows, ' event ', event)
    const selectedRowIndexes = [...this.rowFlightIndexes];
    //this.rowFlightIndexes = this.rowData.filter((row, index) => !this.rowFlightIndexes.includes(row.Flight));
    selectedRows.forEach((selectedRow, index) => {
      const flightIndex = this.rowFlightIndexes.indexOf(selectedRow.Flight);
      if (flightIndex !== -1) {
        console.log('      selectedRows ', selectedRow)
        selectedRowIndexes.splice(flightIndex, 1);
      }
    })

    // this.dashboardFacade.setBrushSelectedFlights(selectedRowIndexes);
  }



  setDataGrid(flights) {
    if (flights.length > 0) {
      this.rowData = flights.map(d => {
        return { cbox: true, Date: d[4], Flight: d[3], Origin: d[5], Destination: d[6], LF: d[1], Ntile: d[2], region: d[7], selected: true }
      })
      setTimeout(() => {
        this.refreshGridData();
      }, 0);
    }

    console.log('this.rowData. ', this.rowData)
  }

  // Set ag-grid headers
  setHeaderNames() {
    //console.log('this.gridOptions.columnDefs ', this.gridOptions.columnDefs)
    this.gridOptions.columnDefs[5].headerName = this.kpiFieldStr[this.plotType];


    this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
    //this.gridApi.applyColumnDefChanges({ update: this.gridOptions.columnDefs });
    this.gridApi.sizeColumnsToFit();
    //this.gridApi.selectAll();
  }

  onFirstDataRendered(event: FirstDataRenderedEvent) {
    console.log('\n\n\n\nThe first data was rendered', event);
  }


  getSelectedRows() {
    var selectedNodes = this.gridApi.getSelectedNodes();
    var selectedData = selectedNodes.map(node => node.data);
    var selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    //console.log(`Selected nodes: ${selectedDataStringPresentation}`);
  }


  refreshGridData() {
    this.gridApi.setRowData(this.rowData);
    this.gridApi.sizeColumnsToFit();
  }

  //  this.gridApi.selectAll();
  public onGridReady(params) {
    console.log('params ', params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 30;
    params.api.forEachNode((node: any) => {
      console.log('node ', node)
      if (node.data.selected) {
        params.api.selectNode(node, true);
      }
    });

  }


  // Sets chart display values per NDO vs Region

  initializeChartValues() {

    //this.setHeaderNames();
    this.chartDataCollection = [];
    let tempCollector = [];

    if (this.rowData.length > 0) {
      let plotVar: string;
      let ntStr: string;
      this.rowData.forEach((d) => {

        plotVar = this.plotType === 0 ? 'Ntile' : 'region'
        ntStr = this.plotType === 0 ? 'Ntile' : ''
        d.LF = this.plotType === 0 ? `${Math.round(d.LF)}%` : d.LF;
        if (!tempCollector[d[plotVar]]) {
          tempCollector[d[plotVar]] = 1;
        }
        for (let i = tempCollector.length - 1; i > 0; i--) {
          if (!tempCollector[i]) {
            tempCollector[i] = 1;
          }
        }
        tempCollector[d[plotVar]] += 1;
      });

      Object.entries(tempCollector).map((d: any, i) => {
        const strConcat = this.plotType === 0 ? `${ntStr}: ${+d[0]}: ` : d[0];
        this.chartDataCollection.push({
          name: `${strConcat}`, value: (d[1] - 1)
        })
      });
      // console.log('initializeChartValues ', this.chartDataCollection)

      setTimeout(() => {
        this.setPieChart();
        this.refreshGridData();
      }, 0)
    }
  }


  setPieChart() {

    const chart: HTMLCanvasElement = document.getElementById('piece-pie') as HTMLCanvasElement;
    if (!this.myChart) {
      this.myChart = echarts.init(chart, 'dark');
    }

    setTimeout(() => {
      this.initializePieChart();
    }, 10)
  }

  public refreshChartVisual = () => {
    this.myChart.resize();
  }

  initializePieChart() {
    const COLOR_ALL = ['#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'];
    const datas = [];
    const dataContainer = [];

    this.chartDataCollection.forEach((el) => {
      if (el.value > 0) {
        dataContainer.push(el)
      }
    })

    datas.push(dataContainer)
    this.myChart.setOption({
      backgroundColor: '#00051c',
      //@ts-ignore
      colors: COLOR_ALL,
      tooltip: {
        show: true
      },
      series: datas.map(data => {

        return {
          type: 'pie',
          radius: [20, 60],
          height: '90%',
          left: 'center',
          width: '80%',
          itemStyle: {
            color: (params) => {
              return COLOR_ALL[params.dataIndex];
            }
          },
          label: {
            alignTo: 'edge',
            formatter: '{name|{b}}\n{value|{c}}',
            minMargin: 5,
            edgeDistance: 15,
            lineHeight: 15,
            rich: {
              value: {
                fontSize: 12,
                color: '#fff'
              }
            }
          },
          labelLine:
          {
            length: 25,
            length2: 0,
            maxSurfaceAngle: 80
          },
          labelLayout: function (params) {
            var isLeft = params.labelRect.x < 200;
            var points = params.labelLinePoints;

            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points
            };
          },
          data: data
        }
      })
    });
  }
}





