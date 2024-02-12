import { Component, Inject } from '@angular/core';
import { DataService } from './config-data-service';
import { PathToAssets, arrows } from './dashboard-constants'
import { environment } from 'src/environments/environment.prod';
import { DOCUMENT } from "@angular/common";

import { Subscription, map, Observable, pairwise, scan, BehaviorSubject } from 'rxjs';

export let fps$: Observable<DOMHighResTimeStamp> = new BehaviorSubject<any>([]);

export function animationFrame({
  requestAnimationFrame,
  cancelAnimationFrame
}: Window): Observable<DOMHighResTimeStamp> {
  return new Observable(subscriber => {
    let id = NaN;

    const callback = (timestamp: DOMHighResTimeStamp) => {
      subscriber.next(timestamp);
      id = requestAnimationFrame(callback);
    };

    id = requestAnimationFrame(callback);

    return () => {
      cancelAnimationFrame(id);
    };
  });
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angular-rm-historical';

  // For Historical Events
  public chartThemeSelect = 'dark';
  public monthlyAvailabilityVisible = false;
  public xAxisViewType = true;

  public isNdoChecked = true;
  public isThemeChange = true;

  public pathToAssets = PathToAssets;
  public currentApplicationVersion = environment.appVersion;
  public frameRateCounterState = false;

  public toggleQueryVisible = true;

  public openCloseIcon: string = "box-arrow-left"

  public screenGroupSubject$ = new BehaviorSubject<any>([]);
  public selectedScreen = 0;

  public openDetailsFlag = false;

  // @Inputs
  public regionSelect: any;
  public plotTypeSelect: number = 0;

  public dragGrouping: any = [
    { name: 'Data Categorization', id: 0, active: false, disabled: false },
    { name: 'Metric Comparison', id: 1, active: false, disabled: false }
  ];


  //public fps$: Observable<DOMHighResTimeStamp> = new BehaviorSubject<any>([]);

  fps$ = animationFrame(this.documentRef.defaultView as Window)
    .pipe(
      pairwise(),
      scan((acc: any, [prev, cur]) => {
        if (acc.push(1000 / (cur - prev)) > 60) {
          acc.shift();
        }
        return acc;
      }, []),
      map(arr => Math.round(arr.reduce((acc: any, cur: any) => acc + cur, 0) / arr.length))
    );

  constructor(public dataService: DataService, @Inject(DOCUMENT) private readonly documentRef: Document) {

    this.dataService.dashboardFacade.getBrushSelectedFlights()
      .subscribe((response: any[]) => {

        if (response.length > 0) {

        } else {
          this.openDetailsFlag = false;
        }
        //console.log('APP Component   response ', response)

      })

    this.screenGroupSubject$.next(this.dragGrouping);
  }


  public openDetailsWindow() {
    console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.openDetailsFlag);
    this.openDetailsFlag = !this.openDetailsFlag;

  }

  public setScreen(idx: number) {
    console.log('setScreen ', idx);
    this.dragGrouping[idx];
  }

  public collapseQueryWindow() {
    console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.toggleQueryVisible)
  }

  public getProperIcon(): string {
    this.openCloseIcon = this.toggleQueryVisible ? "box-arrow-left" : "box-arrow-right";
    return this.openCloseIcon
  }

  public toggleFrameRate() {
    this.frameRateCounterState = !this.frameRateCounterState;
  }

  // View Net Dates Out or NDO nums
  public onClickSetXaxisViewType(ev: any) {
    this.xAxisViewType = ev.values[0];
  }

  // From Historical Events Monthly Availability Switch
  public onToggleMonthlyAvailabilitySwitch(ev: any) {
    this.monthlyAvailabilityVisible = !this.monthlyAvailabilityVisible;
  }

  // public toggle(event: MatSlideToggleChange) {
  //   console.log('toggle', event.checked);
  //   this.chartThemeSelect = scheme.values[0] ? 'dark' : 'light';
  //   this.useDefault = event.checked;
  // }

  // On Theme change Dark/Light
  onThemeChange(scheme: any) {

    this.chartThemeSelect = this.isThemeChange ? 'dark' : 'light';
    console.log('onThemeChange ', this.chartThemeSelect, ' isThemeChange ', this.isThemeChange)
  }

}
