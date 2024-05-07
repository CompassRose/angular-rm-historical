import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError, finalize, map } from 'rxjs';

import { environment } from '../../../src/environments/environment';


import {
  AnalyticsQueryRequest,
  AnalyticsQueryResponse,
  ColumnValues,
  QueryMap,
  InventoryValues
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})

export class DashboardApi {

  readonly MonthlyAvailable_URL = './assets/dummyAPI/avail_by_month-par.csv';
  readonly MonthlyAvailable1_URL = './assets/dummyAPI/avail_by_month-test-1.csv';
  readonly MonthlyAvailable7_URL = './assets/dummyAPI/avail_by_month-test-07.csv';
  readonly MonthlyAvailable52_URL = './assets/dummyAPI/avail_by_month-test-52.csv';


  readonly KpiClusters_URL = './assets/dummyAPI/ClusterValuesFixed.csv';

  readonly KpiCategorization_URL = './assets/dummyAPI/KPI_Categorization.csv';
  readonly AirportCodes_URL = './assets/dummyAPI/airports_small.csv';
  readonly CompetitiveFare_URL = './assets/dummyAPI/comp-fares01.csv';
  readonly LafProgression_URL = './assets/dummyAPI/FlightView_by_Ndo01.csv';
  readonly Seasonality_URL = './assets/dummyAPI/seasonality.csv';

  readonly apiDataQueryColumns = './assets/dummyAPI/AllColumnsByModelType.response.json';
  readonly apiDataQueryInventory = './assets/dummyAPI/InventoryConfig.response.json';

  // awk command to remove spaces in .csv
  // $ awk '{gsub(/^ +| +$/,''); gsub(/ *, */,',')}1' 'PNR_Bk_by_Hour.csv'

  readonly myWorld = '../../assets/world.json';

  private readonly analytics_url: string = 'Analytics';
  private readonly apiTableColumnsQuery = 'tablerepo/table/';
  private readonly apiTableQuery = 'tablerepo/alltablessummary';

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient) {

  }


  public getWorld(): Observable<any> {
    return this.http
      .get(this.myWorld, { responseType: 'text' })
      .pipe(map(res => {
        //console.log('res world ', JSON.parse(res))
        return JSON.parse(res)
      }));
  }


  public queryTableApi(): Observable<QueryMap> {
    console.log(' full path ', `${this.apiUrl}/${this.apiTableQuery}`)
    return this.http.get<QueryMap>(
      `${this.apiUrl}/${this.apiTableQuery}`
    )
      .pipe(
        map(res => {
          console.log('res ', res)
          return res;
        }),
        catchError(error => {
          throw error;
        }),
      );
  }

  public queryTableColumnsApi(payload: any): Observable<QueryMap> {
    return this.http.get<QueryMap>(
      `${this.apiUrl}${this.apiTableColumnsQuery}${payload}`
    )
      .pipe(
        map(res => {
          return res;
        }),
        catchError(error => {
          throw error;
        }),
      );
  }

  public queryAnalyticsApi(requestBody: AnalyticsQueryRequest): Observable<AnalyticsQueryResponse> {
    const headers = { 'Content-Type': 'application/json;charset=UTF-8' };

    return this.http.post<any>(
      `${this.apiUrl}${this.analytics_url}`
      , requestBody
      , { headers }
    )
      .pipe(
        map(res => res),
        catchError(error => {
          throw error;
        }),
      );
  }


  public callApiQuery(args: string): Observable<any> {
    return this.http
      .get<ColumnValues>(this.apiDataQueryColumns)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(error => {
          throw error;
        }),
      );
  }



  getColumns(): Observable<ColumnValues> {
    return this.http.get<ColumnValues>(this.apiDataQueryColumns);
  }



  getInventory(): Observable<InventoryValues> {
    return this.http.get<InventoryValues>(this.apiDataQueryInventory);
  }


  getCsvData(): Observable<any[]> {
    return this.http
      .get(this.Seasonality_URL, { responseType: 'text' })
      .pipe(map(res => {
        return this.csvJSON(res);
      }));
  }



  getKpiClusteredData(): Observable<any[]> {
    return this.http
      .get(this.KpiClusters_URL, { responseType: 'text' })
      .pipe(map(res => {
        return this.clusterCsvJSON(res);
      }));
  }

  getKPI_CategorizationData(): Observable<any[]> {
    return this.http
      .get(this.KpiCategorization_URL, { responseType: 'text' })
      .pipe(map(res => {
        // console.log('\n\n\n res ', res)
        return this.csvJSON(res);
      }));
  }

  getProgressionData(): Observable<any[]> {
    return this.http
      .get(this.LafProgression_URL, { responseType: 'text' })
      .pipe(map(res => {
        return this.csvJSON(res);
      }));
  }


  getMonthlyAvailableData(metric: any): Observable<any[]> {
    return this.http
      .get(this[`${metric}`], { responseType: 'text' })
      .pipe(map(res => {
        return this.pivotCsvJSON(res);
      }));
  }

  getCompetitiveFareData(): Observable<any[]> {
    return this.http
      .get(this.CompetitiveFare_URL, { responseType: 'text' })
      .pipe(map(res => {
        return this.csvJSON(res);
      }));
  }

  getAirportCodes(): Observable<any[]> {
    return this.http
      .get(this.AirportCodes_URL, { responseType: 'text' })
      .pipe(map(res => {
        return this.csvAirportCodesJSON(res);
      }));
  }

  pivotCsvJSON(csv: any) {
    const lines = csv.split(/[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/\s/, '');
    }

    const headers = lines[0].split(',');
    const final: any[][] = [];
    for (let j = 0; j < headers.length; j++) {
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const result: any[] = [];
        const currentline = lines[i].split(',');
        result.push(i - 1, j, Number(currentline[j]));
        final.push(result);
      }
    }

    return [final, headers];
    // return JSON.stringify(result); //JSON
  }



  csvAirportCodesJSON(csv: any) {
    const lines = csv.split(/[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/\s/, '');
    }
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');


      for (let j = 0; j < headers.length; j++) {
        //console.log('currentline ', currentline)
        if (headers[j] !== 'coordinates') {
          obj[headers[j].toString()] = currentline[j];
        } else {
          let temp3 = currentline[2].replace(/['"]+/g, '')
          let temp4 = currentline[3].replace(/['"|/\s/]+/g, '')
          temp3 = Math.round((+temp3 * 100) / 100)
          temp4 = Math.round((+temp4 * 100) / 100)
          const tester = [];
          tester.push(temp4, temp3)
          obj[headers[j]] = tester;
        }
      }
      result.push(obj);
    }
    return result;
    // return JSON.stringify(result); //JSON
  }


  clusterCsvJSON(csv: any) {

    const lines = csv.split(/[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/\s/, '');
    }
    const result = [];
    const headers = lines[0].split(',');

    headers.unshift('Destination')
    headers.unshift('Origin')

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');
      currentline.unshift('')
      currentline.unshift('')
      // if (i < 10) {
      //   console.log(' --- Line ', currentline, ' headers ', headers)

      // }
      for (let j = 0; j < headers.length; j++) {

        const Origin = currentline[2].substring(0, 3);
        const Destination = currentline[2].substring(3, 6);

        //console.log(' Origin ', Origin, ' dest ', Destination)
        currentline[0] = Origin;
        currentline[1] = Destination;

        obj[headers[j].toString()] = currentline[j];
      }
      result.push(obj);
    }
    return result;
    // return JSON.stringify(result); //JSON
  }

  csvJSON(csv: any) {
    const lines = csv.split(/[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/\s/, '');
    }
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].toString()] = currentline[j];
      }
      result.push(obj);
    }
    return result;
    // return JSON.stringify(result); //JSON
  }
}

