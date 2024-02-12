
import { DashboardState } from './dashboard.state';
import { DashboardApi } from './api/dashboard.api';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeasonalItems, HistoryData, QueryMap, QueryItems, ODLocate, TableValues, ColumnValues, InventoryValues } from './models/dashboard.model';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DashboardFacade {

  public worldCoordinatesBehaviorSubject$ = new Subject<any>();

  constructor(
    private dashboardAPI: DashboardApi,
    public dashboardState: DashboardState
  ) { }


  // Global Code-mirror content 
  public setMirrorContent(options: any) {
    this.dashboardState.setMirrorOptions(options)
  }


  public getMirrorContent(): Observable<any> {
    return this.dashboardState.getMirrorOptions()
  }

  // From Set Query panel
  public sendQueryItems(items: QueryItems) {
    // console.log('sendQueryItems ', items)
    this.dashboardState.setQueryList(items)
  }


  // From Set Query panel
  public getQueryItems(): Observable<QueryItems> {
    return this.dashboardState.returnQueryList();
  }

  // Global Regions List
  public sendRegionList(regions: string[]) {
    this.dashboardState.setRegionList(regions)
  }

  public sendNdoList(Ndos: any) {
    this.dashboardState.setNdoList(Ndos)
  }

  public getRegionList(): Observable<string[]> {
    return this.dashboardState.returnRegionList();
  }

  public getNdoList(): Observable<any> {
    return this.dashboardState.returnNdoList();
  }

  public setplotTypes(plotValues: any) {
    this.dashboardState.setplotTypes(plotValues)
  }

  public getplotType(): Observable<any> {
    return this.dashboardState.returnplotType()
  }


  loadMonthlyAvailableData(metric: any) {
    this.dashboardAPI
      .getMonthlyAvailableData(metric)
      .subscribe((response: any[]) => {
        return this.dashboardState.setMonthlyAvailabilityData(response);
      });
  }

  loadCompetitiveFareData() {
    this.dashboardAPI
      .getCompetitiveFareData()
      .subscribe((response: any[]) => {

        return this.dashboardState.setCompetitiveFareData(response);
      });
  }

  loadAirportCodes() {
    this.dashboardAPI
      .getAirportCodes()
      .subscribe((response: any[]) => {
        //console.log('response ', response)
        this.dashboardState.setAirportCodes(response);
      });
  }

  loadProgressiveData() {
    this.dashboardAPI
      .getProgressionData()
      .subscribe((response: HistoryData[]) => {
        return this.dashboardState.setPreviousYearData(response);
      });
  }

  loadAnalyticApiData(requestObject: any) {
    this.dashboardAPI
      .queryAnalyticsApi(requestObject)
      .subscribe((response: any) => {
        return this.dashboardState.setAnalyticApiValues(response);
      });
  }

  getClusteredData(): Observable<any> {
    return this.dashboardState.getClusteredValues();
  }


  loadClusteredData() {
    this.dashboardAPI
      .getKpiClusteredData()
      .subscribe((response: any[]) => {
        //console.log('CLUSTER response ', response)
        this.dashboardState.setClusteredValues(response)

      });
  }


  loadTableApiData() {
    this.dashboardAPI
      .queryTableApi()
      .subscribe((response: any) => {
        return this.dashboardState.setTableApiValues(response);
      });
  }

  // loadColumnsApiData(payload: any) {
  //   this.dashboardAPI
  //     .queryTableColumnsApi(payload)
  //     .subscribe((response: any) => {
  //       this.dashboardState.setTableColumnApiValues(response);
  //     });
  // }

  getTableApiData(): Observable<TableValues[]> {
    return this.dashboardState.getTableApiValues();
  }

  // getTableColumnApiData(): Observable<QueryMap> {
  //   return this.dashboardState.getTablColumnApiValues();
  // }


  getAnalyticApiData(): Observable<any> {
    return this.dashboardState.getAnalyticValues();
  }

  public getMyWorld(): any {

    this.dashboardAPI
      .getWorld()
      .subscribe((response: any[]) => {
        // console.log('response ', response)
        this.worldCoordinatesBehaviorSubject$.next(response)
        //newWorld = response;
      });

  }

  // Competetive Fare Metrics
  loadCategorizedData(ref: any): Observable<any[]> {
    const res = this.dashboardAPI
      .getKPI_CategorizationData();

    res.subscribe((response: any[]) => {
      // console.log('getKPI_CategorizationData response ', response)
      return this.dashboardState.setCategorizedValues(response);
    });

    return res;
  }

  // Table API
  loadColumns(args: string): Observable<ColumnValues> {
    const res = this.dashboardAPI
      .callApiQuery(args)
    res.subscribe((response: ColumnValues) => {
      return this.dashboardState.setColumnValues(response);
    })
    return res;
  }

  // Table API
  loadInventory(): Observable<InventoryValues> {
    const res = this.dashboardAPI
      .getInventory()
    res.subscribe((response: InventoryValues) => {
      return this.dashboardState.setInventoryValues(response);
    });
    return res;
  }

  getColumnValues(): Observable<ColumnValues> {
    return this.dashboardState.getColumns();
  }

  getInventoryValues(): Observable<InventoryValues> {
    return this.dashboardState.getInventory();
  }

  // Sets indexes of selected flights - Used in details, world comps
  setBrushSelectedFlights(brushSelected: number[]) {
    this.dashboardState.setBrushSelectedFlights(brushSelected);
  }

  getBrushSelectedFlights(): Observable<any[]> {
    return this.dashboardState.getBrushSelectedFlights();
  }
  ///// End 

  getAirportCodes(): Observable<ODLocate[]> {
    return this.dashboardState.getAirportCodes();
  }

  getGlobalRegions(): Observable<any> {
    return this.dashboardState.getGlobalRegions();
  }

  // Flight Categorizion Values from local JSON
  getCategoryValues(regions: string[], plot: any, ndoRange: any): Observable<any> {
    return this.dashboardState.getCategorizedValues(regions, plot, ndoRange);
  }

  setRegionDestinationList() {
    this.dashboardState.setRegionSpecificDestinations();
  }

  getRegionDestinationList(): Observable<any[]> {
    return this.dashboardState.getRegionSpecificDestinations();
  }

  getFlightHistory(): Observable<HistoryData[]> {
    return this.dashboardState.getStaticMetricData();
  }

  getCompetitiveFareValues(): Observable<any[]> {
    return this.dashboardState.getStaticCompFareData();
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
