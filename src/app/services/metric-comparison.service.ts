import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DashboardFacade } from '../dashboard.facade';
import { HistoryData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class MetricDataService {
  private progressiveData: any;
  private competitiveFareData: any;

  public progressiveDataSubject$ = new BehaviorSubject<HistoryData[]>([]);

  constructor(private dashboardFacade: DashboardFacade) {
    this.dashboardFacade.loadProgressiveData();
  }

  public loadProgressiveData(): Observable<HistoryData[]> {
    if (this.progressiveData) {
      return of(this.progressiveData);
    } else {
      return this.dashboardFacade.loadProgressiveData().pipe(
        tap((data) => {
          console.log(
            '(this.progressiveData = data) ',
            (this.progressiveData = data)
          );
          return (this.progressiveData = data);
        })
      );
    }
  }

  public loadCompetitiveFareData(): Observable<any> {
    //console.log('loadCompetitiveFareData ', this.competitiveFareData);
    if (this.competitiveFareData) {
      // console.log('TRUE loadCompetitiveFareData ', this.competitiveFareData);
      return of(this.competitiveFareData);
    } else {
      return this.dashboardFacade.loadCompetitiveFareData().pipe(
        tap((data) => {
          //   console.log(
          //     'FALSE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   loadCompetitiveFareData ',
          //     (this.competitiveFareData = data)
          //   );
          return (this.competitiveFareData = data);
        })
      );
    }
  }
}
