// Angular imports
import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';

// Third Party imports
import { Subject, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

// UI SDK imports 
//import { McfAlertService } from '@accelya/sdk/mcf-alert';
//import { IResponsiveDatatableColumn, McfResponsiveDatatableComponent } from '@accelya/sdk/mcf-responsive-datatable';

// Codemirror imports
import { json } from '@codemirror/lang-json';
import { defaultKeymap } from '@codemirror/commands';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { history, historyKeymap } from '@codemirror/history';
import { basicSetup } from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';

import * as examples from '../../assets/js/echarts_examples.js';
import * as echarts from 'echarts';
import * as moment from 'moment';

// App Specific imports
import { DashboardFacade } from '../dashboard.facade';
import { AnalyticsQueryResponse, ScriptContent, ChartDisplayType } from '../models/dashboard.model';
import { Chart } from './services/chart';
import { ChartConfigType } from '../api-workbench/services/dashboad-enums';
import * as rmcharts from '../shared/rmChartsUserLibrary';


import {
  jsonContent,
  simpleTableContent,
  sunburstExample,
  heatmapExample,
  treeChart,
  dualChartsHeatScatter,
  treeMap,
  departuresNodeGraph,
  totalBkCrossGraph
} from '../dashboard-constants.js';


@Component({
  selector: 'app-api-workbench',
  templateUrl: './api-workbench.component.html',
  styleUrls: ['./api-workbench.component.scss']
})

export class ApiWorkbenchComponent implements OnInit, AfterViewInit {

  // Responsive Data table columns and rows
  public columnsTable: any[];
  public datatableRows = [];
  public fieldsToDownload: Array<string> = [];
  public choiceOptions = [];
  //--

  public scriptSourceCollection: ScriptContent[] = [];

  // From Script save name input
  public newScriptName: string;

  // Rxjs async Observables
  public loadingSubject$ = new Subject<boolean>();
  public selectedScript$ = new BehaviorSubject<ScriptContent>(null);
  public displayMetric$ = new BehaviorSubject<ChartDisplayType>(null);
  public jsonContentBehaviorSubject$ = new BehaviorSubject<ScriptContent[]>([]);

  public displayType: ChartDisplayType[] = [
    { id: 0, value: ChartConfigType.simpleTableContent, metric: simpleTableContent },
    { id: 1, value: ChartConfigType.heatmapExample, metric: heatmapExample },
    { id: 2, value: ChartConfigType.dualChartsHeatScatter, metric: dualChartsHeatScatter },
    { id: 3, value: ChartConfigType.dualChartsSelect, metric: sunburstExample },
    { id: 4, value: ChartConfigType.treeChartSelect, metric: treeChart },
    { id: 5, value: ChartConfigType.treeMap, metric: treeMap },
    { id: 6, value: ChartConfigType.nodeGraph, metric: departuresNodeGraph },
    { id: 7, value: ChartConfigType.crossGraph, metric: totalBkCrossGraph }
  ];

  @ViewChild('userScriptOutput', { static: false }) userScriptOutput !: ElementRef;
  @ViewChild('userScriptSource', { static: false }) userScriptSource !: ElementRef;
  @ViewChild('responsiveDatatable', { static: true }) responsiveDatatable: any;

  public jsonContent: string = jsonContent;

  public apiResponseContainer: AnalyticsQueryResponse;
  public toggleJsVisible = true;
  public chart: Chart;

  // From No name in script input
  public alertValue = 'Please Enter a Script Name';

  public jsonExtensions = [
    basicSetup,
    history(),
    // @ts-ignore
    keymap.of([...defaultKeymap, ...historyKeymap]),
    json(),
    defaultHighlightStyle
  ];

  //private alertService: McfAlertService 
  constructor(private dashboardFacade: DashboardFacade) { }


  public ngOnInit(): void {
    this.setupListeners();
    this.displayMetric$.next(this.displayType[0])
    this.fieldsToDownload = [];
  }


  public ngAfterViewInit(): void {

    if (JSON.parse(localStorage.getItem('requestObject'))) {
      this.scriptSourceCollection = [];
      const storage = JSON.parse(localStorage.getItem('requestObject'));

      this.scriptSourceCollection = storage.map((d, i) => {
        if (d.default) {
          this.selectedScript$.next(d);
          this.jsonContent = JSON.stringify(d.values, null, 4);
        }
        return d;
      })
      this.jsonContentBehaviorSubject$.next(this.scriptSourceCollection);
    } else {
      this.scriptSourceCollection = [{ id: this.scriptSourceCollection.length, name: 'Default', default: true, values: JSON.parse(this.jsonContent) }];
      this.selectedScript$.next(this.scriptSourceCollection[0]);
      this.jsonContentBehaviorSubject$.next(this.scriptSourceCollection);
      localStorage.setItem('requestObject', JSON.stringify(this.scriptSourceCollection));
    }
  }


  // Respond from any doRun Presses
  public setupListeners() {

    this.dashboardFacade.getAnalyticApiData()
      .subscribe((response: any) => {
        if (response.data && response.data.length > 0) {
          this.apiResponseContainer = response;
          this.formatDates(response);
          this.configToDatatableRows(response)
          this.convertToScript(response);
        }
      });
  }

  // Config data for Responsive datatable (UI SDK)
  public configToDatatableRows(apiResponse) {

    let countDecimals = (value) => {
      if ((value % 1) != 0 && !Number.isInteger(value)) {
        return value.toString().split(".")[1].length;
      }
    };

    let getRoundedData = (num) => {
      return (num * 100).toFixed(0) + '%';
    }


    let appendTableData = () => {

      this.columnsTable = apiResponse.resourceNames.map((f, i) => {
        if (f.includes("LegInventory:")) {
          f = f.replace('LegInventory:', '')
        } else if (f.includes("LegSnapshot:")) {
          f = f.replace('LegSnapshot:', '')
        } else if (f.includes("LegSchedule:")) {

          f = f.replace('LegSchedule:', '')

          this.choiceOptions.push({
            value: f,
            label: f
          })
        }
        this.fieldsToDownload.push(f);
        return {
          field: f,
          options: {
            title: f,
            search: true,
            sortable: true
          }
        }
      })

      this.datatableRows = [];

      apiResponse.data.forEach((d, i) => {
        let temp = {};
        d.forEach((n, j) => {
          if (!isNaN(n) && countDecimals(n) > 0) {
            n = getRoundedData(n);
          }
          temp[this.columnsTable[j].options.title] = n;
        })
        this.datatableRows.push(temp)
      })
    }

    appendTableData();
  }


  // Called on script name input text entry
  public myInputOnChange(e) {
    this.newScriptName = e.value;
  }

  public apiResponse(responseObject: AnalyticsQueryResponse) {
    return () => {
      responseObject;
    }
  }


  // From Saved Script dropdown change
  public onScriptSelectChange(ev) {
    const element = this.scriptSourceCollection.findIndex((idx) => idx.name === ev.name);
    this.selectedScript$.next(this.scriptSourceCollection[element]);
    this.jsonContent = JSON.stringify(this.scriptSourceCollection[element].values, null, 4);
  }


  // // If no save script name when save btn pressed
  // onWarningAlert() {
  //   this.alertService.showAlert({
  //     title: 'Warning!',
  //     body: this.alertValue,
  //     type: 'error',
  //     options: {
  //       showProgressBar: false,
  //       bodyMaxLength: 100,
  //       position: 'leftTop',
  //       buttons: [
  //         { text: 'Return', action: toast => console.log('Clicked Warning' + toast.value), bold: false }
  //       ]
  //     }
  //   });
  // }

  // From Save Script button press
  public saveScript() {

    if (this.newScriptName === undefined) {
      //this.onWarningAlert();
    } else {
      let isDefault = false;
      if (this.scriptSourceCollection.length === 0) {
        isDefault = true;
      }

      this.scriptSourceCollection = [...this.scriptSourceCollection, { id: this.scriptSourceCollection.length, name: this.newScriptName, default: isDefault, values: JSON.parse(this.jsonContent) }];
      this.jsonContentBehaviorSubject$.next(this.scriptSourceCollection);
      localStorage.setItem('requestObject', JSON.stringify(this.scriptSourceCollection));
      setTimeout(() => {
        this.newScriptName = undefined;
        this.selectedScript$.next(this.scriptSourceCollection[this.scriptSourceCollection.length - 1]);
      }, 50);
    }
  }

  public setDefaultItem(ev) {
    const el = this.scriptSourceCollection.findIndex(idx => idx.name === ev.name)
    this.scriptSourceCollection.forEach((d, i) => {
      d.default = false;
    })
    this.scriptSourceCollection[el].default = true;
    localStorage.setItem('requestObject', JSON.stringify(this.scriptSourceCollection));
    event.stopPropagation();
    event.preventDefault();
  }

  // From Saved script list close button press
  public removeScriptItem(ev) {
    this.scriptSourceCollection.splice(this.scriptSourceCollection.findIndex(idx => idx.name === ev.name), 1);
    this.jsonContentBehaviorSubject$.next([...this.scriptSourceCollection]);
    this.selectedScript$.next(this.scriptSourceCollection[0]);
    localStorage.setItem('requestObject', JSON.stringify(this.scriptSourceCollection));
    event.stopPropagation();
    event.preventDefault();
  }


  // Called from Run Query Btn
  doRun() {
    this.loadingSubject$.next(true);
    const requestObject = JSON.parse(this.jsonContent);
    this.dashboardFacade.loadAnalyticApiData(requestObject);
  }

  // From Display Type dropdown
  public onChartTypeChange(ev) {
    this.displayMetric$.next(this.displayType[ev.id])
    this.convertToScript(this.apiResponseContainer)
  }

  cleanupPrevious() {
    if (this.userScriptSource.nativeElement.querySelector('#scriptNode')) {
      const element = this.userScriptSource.nativeElement.querySelector('#scriptNode')
      element.remove();
    }
  }

  // Moment format
  private getFormattedData(date) {
    return moment.utc(date).format('MM/D/YYYY');
  }

  public formatDates(values) {
    const data = values.data;
    values.data = data.map((d, i) => {
      d[2] = this.getFormattedData(d[2]);
      return d;
    })
  }


  convertToScript(responseObject: AnalyticsQueryResponse) {
    this.cleanupPrevious();
    (window as any).apiResponse = null;
    (window as any).apiResponse = responseObject;
    (window as any).echarts = echarts;
    (window as any).outputDiv = this.userScriptOutput.nativeElement;
    (window as any).rmcharts = rmcharts;
    (window as any).examples = examples;

    const element = this.userScriptSource.nativeElement;
    let metric: string;

    this.displayMetric$.pipe(take(1)).subscribe(res => {
      metric = res.metric;
    });

    setTimeout(() => {
      const script = document.createElement('script');
      script.setAttribute("id", "scriptNode");
      script.type = 'text/javascript';
      script.innerHTML = "(function(){\n" + metric + "\n})()";
      setTimeout(() => {
        element.append(script);
      }, 0);
      this.loadingSubject$.next(false);
    }, 100);

  }
}
