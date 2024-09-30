import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import {
  SeasonalItems,
  HistoryData,
  ColumnValues,
  ODLocate,
  QueryItems,
  QueryMap,
  TableValues,
  InventoryValues,
  RegionList,
} from './models/dashboard.model';
import { MetricMapper } from './services/flight-history-mapper';
import { map } from 'rxjs/operators';

const flightDataMapper = new MetricMapper();

@Injectable()
export class DashboardState {
  public apiFlights487Subject$ = new BehaviorSubject<any>([]);
  public apiFlights748Subject$ = new BehaviorSubject<any>([]);
  public apiFlights5145Subject$ = new BehaviorSubject<any>([]);
  public apiFlights50628Subject$ = new BehaviorSubject<any>([]);

  public categorizedValuesSubject$ = new BehaviorSubject<any[]>([]);
  public clusteredValuesSubject$ = new BehaviorSubject<any[]>([]);

  public forecastDataSubject$ = new Subject<any>();
  public previousYearDataSubject$ = new Subject<HistoryData[]>();
  public progressionDataSubject$ = new Subject<any>();
  public competitiveFareSubject$ = new Subject<any>();

  public monthlyAvailabiltySubject$ = new BehaviorSubject<any[]>([]);
  public availabilityCollection: any[] = [];

  public airportCodesBehaviorSubject$ = new BehaviorSubject<ODLocate[]>([]);
  public brushSelectedFlights$ = new BehaviorSubject<any>([]);

  public columnValues$ = new BehaviorSubject<ColumnValues>(null);
  public inventoryValues$ = new Subject<InventoryValues>();
  public regionDestinations$ = new BehaviorSubject<any>([]);

  public apiCallSubBehaviorSubject$ = new BehaviorSubject<any>({});

  public regionListBehaviorSubject$ = new BehaviorSubject<string[]>([]);
  public ndoListBehaviorSubject$ = new BehaviorSubject<any>([]);
  public plotTypeBehaviorSubject$ = new BehaviorSubject<any>([]);

  public queryItemBehaviorSubject$ = new BehaviorSubject<any>({});

  public tableColumnApiSubject$ = new BehaviorSubject<QueryMap>(null);

  public tableApiSubject$ = new BehaviorSubject<TableValues[]>([]);

  // ---------------
  // Flight Categorization values Shared with Details. World Components

  public setQueryList(items: QueryItems) {
    this.queryItemBehaviorSubject$.next(items);
  }

  public returnQueryList(): Observable<QueryItems> {
    return this.queryItemBehaviorSubject$;
  }

  public setRegionList(regions: string[]) {
    this.regionListBehaviorSubject$.next(regions);
  }

  public setNdoList(ndoVals: any[]) {
    this.ndoListBehaviorSubject$.next(ndoVals);
  }

  public setplotTypes(value: any) {
    console.log('setplotTypes ', value);
    this.plotTypeBehaviorSubject$.next(value);
  }

  public returnplotType(): Observable<any> {
    return this.plotTypeBehaviorSubject$;
  }

  public returnRegionList(): Observable<string[]> {
    return this.regionListBehaviorSubject$;
  }

  public returnNdoList(): Observable<any> {
    return this.ndoListBehaviorSubject$;
  }

  ///  End
  // ---------------

  public setAirportCodes(codes: any[]) {
    this.airportCodesBehaviorSubject$.next(codes);
  }

  public getAirportCodes(): Observable<ODLocate[]> {
    return this.airportCodesBehaviorSubject$.asObservable();
  }

  public getStaticMetricData(): Observable<any[]> {
    return this.previousYearDataSubject$.pipe(
      map((items: any[]) => {
        console.log(
          'previousYearDataSubject$ previousYearDataSubject$ ********************'
        );
        return flightDataMapper.convertValuesToMetricModel(items);
      })
    );
  }

  public setClusteredValues(values: any[]) {
    this.clusteredValuesSubject$.next(values);
  }

  public getClusteredValues(): Observable<any[]> {
    return this.clusteredValuesSubject$.asObservable();
  }

  public getCategorizedValues(
    region: any[],
    plot: any,
    ndoRanges: any
  ): Observable<any[]> {
    let returnItems = [];
    return this.categorizedValuesSubject$.pipe(
      map((items: any[]) => {
        if (items.length > 0) {
          //console.log('items ', items)
          returnItems = flightDataMapper.convertCategorizedModel(
            items,
            region,
            plot,
            ndoRanges
          );
        }
        return returnItems;
      })
    );
  }

  public setGlobalRegionObjects(regions: any[]) {
    flightDataMapper.regionCollectionSubject$.next(regions);
  }

  public getGlobalRegionObjects(): Observable<RegionList[]> {
    return flightDataMapper.regionCollectionObjectSubject$;
  }

  public getGlobalRegions(): Observable<any[]> {
    return flightDataMapper.regionCollectionSubject$.asObservable();
  }

  public setTableApiValues(tableData: TableValues[]) {
    this.tableApiSubject$.next(tableData);
  }

  public setTableColumnApiValues(tableData: QueryMap) {
    this.tableColumnApiSubject$.next(tableData);
  }

  public getTableApiValues(): Observable<TableValues[]> {
    return this.tableApiSubject$.asObservable();
  }

  public getTablColumnApiValues(): Observable<QueryMap> {
    return this.tableColumnApiSubject$.asObservable();
  }

  public setAnalyticApiValues(values: any) {
    this.apiCallSubBehaviorSubject$.next(values);
  }

  public getAnalyticValues(): Observable<any> {
    return this.apiCallSubBehaviorSubject$.asObservable();
  }

  public setColumnValues(values: ColumnValues) {
    // console.log('  setColumnValues ', values)
    this.columnValues$.next(values);
  }

  public getColumns(): Observable<any> {
    return this.columnValues$.asObservable();
  }

  public setRegionSpecificDestinations() {
    //console.log('|||||||||  getRegionSpecificDestinations ', flightDataMapper.setDestinationCollection())
    this.regionDestinations$.next(flightDataMapper.setDestinationCollection());
  }

  public getRegionSpecificDestinations(): Observable<any> {
    return this.regionDestinations$.asObservable();
  }

  public setInventoryValues(values: InventoryValues) {
    this.inventoryValues$.next(values);
  }

  public getInventory(): Observable<any> {
    return this.inventoryValues$.asObservable();
  }

  public setBrushSelectedFlights(selected: number[]) {
    //console.log('setBrushSelectedFlights ', selected)
    this.brushSelectedFlights$.next(
      flightDataMapper.getFilteredResults(selected)
    );
  }

  public getBrushSelectedFlights(): Observable<any[]> {
    return this.brushSelectedFlights$.asObservable();
  }

  public setCategorizedValues(values: any[]) {
    //console.log('setCategorizedValues ', values)
    this.categorizedValuesSubject$.next(values);
  }

  public setPreviousYearData(previousYearValues: HistoryData[]) {
    this.previousYearDataSubject$.next(previousYearValues);
  }

  public getCompetitiveFareData(): Observable<any[]> {
    return this.competitiveFareSubject$.asObservable();
  }

  public setCompetitiveFareData(compFares: any[]) {
    //console.log('setCompetitiveFareData ', compFares);
    this.competitiveFareSubject$.next(compFares);
  }

  public getStaticCompFareData(): Observable<any[]> {
    return this.competitiveFareSubject$.pipe(
      map((items: any[]) => {
        console.log('items ', items);
        return flightDataMapper.convertCompetitiveFareModel(items);
      })
    );
  }

  public setMonthlyAvailabilityData(previousYearValues: any[]) {
    this.availabilityCollection.push(previousYearValues);
    console.log('setMonthlyAvailabilityData ', previousYearValues);
    this.monthlyAvailabiltySubject$.next(this.availabilityCollection);
  }

  public getMonthlyAvailabilityData(): Observable<any[]> {
    console.log('getMonthlyAvailabilityData )))))))))))))))))))))))))))   ');
    return this.monthlyAvailabiltySubject$.asObservable();
  }

  public getPreviousYearData(): Observable<any[]> {
    return this.previousYearDataSubject$.asObservable();
  }

  public setProgressionData(progressionValues: any[]) {
    this.progressionDataSubject$.next(progressionValues);
  }

  public getProgressionData(): Observable<any[]> {
    return this.progressionDataSubject$.asObservable();
  }

  public setForecastData(forecastValues: SeasonalItems[]) {
    this.forecastDataSubject$.next(forecastValues);
  }

  public getForecastData(): Observable<SeasonalItems[]> {
    return this.forecastDataSubject$.asObservable();
  }
}
