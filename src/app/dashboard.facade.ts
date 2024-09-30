import { DashboardState } from './dashboard.state';
import { DashboardApi } from './api/dashboard.api';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import {
  SeasonalItems,
  HistoryData,
  QueryMap,
  QueryItems,
  ODLocate,
  TableValues,
  ColumnValues,
  InventoryValues,
  RegionList,
} from './models/dashboard.model';
import {
  plotListLeftOptions,
  marketAnalysisOptions,
} from './dashboard-constants';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  public dragGrouping: any = [
    {
      name: 'Data Categorization',
      id: 0,
      active: false,
      disabled: false,
      plotTypeOptions: plotListLeftOptions,
    },
    {
      name: 'Metric Comparison',
      id: 1,
      active: false,
      disabled: false,
      plotTypeOptions: marketAnalysisOptions,
    },
  ];

  public selectedScreen = 0;

  public worldCoordinatesBehaviorSubject$ = new BehaviorSubject<any>(null);

  public screenGroupSubject$ = new BehaviorSubject<any>([]);

  public screenSelectedSubject$ = new BehaviorSubject<number>(0);

  public competitiveFareCollectionSubject$ = new BehaviorSubject<any>([]);
  public progressiveCollectionSubject$ = new BehaviorSubject<any>([]);

  constructor(
    private dashboardAPI: DashboardApi,
    public dashboardState: DashboardState
  ) {}

  // From Set Query panel
  public sendQueryItems(items: QueryItems) {
    //console.log('sendQueryItems ', items)
    this.dashboardState.setQueryList(items);
  }

  // From Set Query panel
  public getQueryItems(): Observable<QueryItems> {
    return this.dashboardState.returnQueryList();
  }

  // Global Regions List
  public sendRegionList(regions: string[]) {
    this.dashboardState.setRegionList(regions);
  }

  public sendNdoList(Ndos: any) {
    this.dashboardState.setNdoList(Ndos);
  }

  public getRegionList(): Observable<string[]> {
    return this.dashboardState.returnRegionList();
  }

  public getNdoList(): Observable<any> {
    return this.dashboardState.returnNdoList();
  }

  public setplotTypes(plotValues: any) {
    this.dashboardState.setplotTypes(plotValues);
  }

  public getplotType(): Observable<any> {
    return this.dashboardState.returnplotType();
  }

  loadMonthlyAvailableData(metric: any) {
    this.dashboardAPI
      .getMonthlyAvailableData(metric)
      .subscribe((response: any[]) => {
        console.log('response ', response);
        return this.dashboardState.setMonthlyAvailabilityData(response);
      });
  }

  loadCompetitiveFareData(): Observable<any[]> {
    return this.dashboardAPI.getCompetitiveFareData().pipe(
      tap((response: any[]) => {
        // console.log('response ', response);
        this.dashboardState.setCompetitiveFareData(response);
      })
    );
  }

  getCompetitiveFareValues(): Observable<any[]> {
    console.log(
      'getCompetitiv eFareValues getCompetitive FareValues getCompetitive FareValues'
    );
    const test = this.dashboardState.getStaticCompFareData();
    console.log('test ', test);
    return test;
  }

  loadProgressiveData(): Observable<HistoryData[]> {
    return this.dashboardAPI.getProgressionData().pipe(
      tap((response: HistoryData[]) => {
        //console.log('\\n\n\nresponse ', response);
        this.dashboardState.setPreviousYearData(response);
      })
    );
  }

  loadAirportCodes() {
    this.dashboardAPI.getAirportCodes().subscribe((response: any[]) => {
      //console.log('response ', response)
      this.dashboardState.setAirportCodes(response);
    });
  }

  getClusteredData(): Observable<any> {
    return this.dashboardState.getClusteredValues();
  }

  loadClusteredData() {
    this.dashboardAPI.getKpiClusteredData().subscribe((response: any[]) => {
      //console.log('CLUSTER response ', response)
      this.dashboardState.setClusteredValues(response);
    });
  }

  getAnalyticApiData(): Observable<any> {
    return this.dashboardState.getAnalyticValues();
  }

  public getMyWorld(): any {
    this.dashboardAPI.getWorld().subscribe((response: any[]) => {
      //console.log('response ', response)
      this.worldCoordinatesBehaviorSubject$.next(response);
      //newWorld = response;
    });
  }

  // Competetive Fare Metrics
  loadCategorizedData(ref: any): Observable<any[]> {
    const res = this.dashboardAPI.getKPI_CategorizationData();

    res.subscribe((response: any[]) => {
      //console.log('getKPI_CategorizationData response ', response);
      return this.dashboardState.setCategorizedValues(response);
    });
    return res;
  }

  // Sets indexes of selected flights - Used in details, world comps
  setBrushSelectedFlights(brushSelected: number[]) {
    //console.log('\n\n\nsetBrushSelectedFlights brushSelected ', brushSelected)
    this.dashboardState.setBrushSelectedFlights(brushSelected);
  }

  getBrushSelectedFlights(): Observable<any[]> {
    //console.log('getBrushSelectedFlights ',)
    return this.dashboardState.getBrushSelectedFlights();
  }
  ///// End

  getAirportCodes(): Observable<ODLocate[]> {
    return this.dashboardState.getAirportCodes();
  }

  getGlobalRegions(): Observable<any> {
    return this.dashboardState.getGlobalRegions();
  }

  setGlobalRegionObjects(regions: any[]) {
    this.dashboardState.setGlobalRegionObjects(regions);
  }

  getGlobalRegionObjects(): Observable<RegionList[]> {
    return this.dashboardState.getGlobalRegionObjects();
  }

  // Flight Categorizion Values from local JSON
  getCategoryValues(
    regions: string[],
    plot: any,
    ndoRange: any
  ): Observable<any> {
    //console.log('XXXXXXXXXX    getCategoryValues  ', regions);
    return this.dashboardState.getCategorizedValues(regions, plot, ndoRange);
  }

  setRegionDestinationList() {
    this.dashboardState.setRegionSpecificDestinations();
  }

  getRegionDestinationList(): Observable<any[]> {
    return this.dashboardState.getRegionSpecificDestinations();
  }

  getFlightHistory(): Observable<HistoryData[]> {
    console.log('\n\n\n\n\n\n\n\n\n\n\n --------------------------called');
    return this.dashboardState.getStaticMetricData();
  }

  getAvailabilityValues(): Observable<any[]> {
    return this.dashboardState.getMonthlyAvailabilityData();
  }

  getProgressionValues(): Observable<any[]> {
    return this.dashboardState.getProgressionData();
  }

  getPreviousYearValues(): Observable<any[]> {
    return this.dashboardState.getPreviousYearData();
  }

  getForecastValues(): Observable<SeasonalItems[]> {
    return this.dashboardState.getForecastData();
  }
}
