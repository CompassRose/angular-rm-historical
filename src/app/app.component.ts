import { Component, Inject, AfterViewInit } from '@angular/core';
import { DataService } from './config-data-service';
import { PathToAssets, arrows } from './dashboard-constants'
import { environment } from 'src/environments/environment.prod';
import { DOCUMENT } from "@angular/common";

import { map, Observable, pairwise, scan, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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

export class AppComponent implements AfterViewInit {
  //////title = 'angular-rm-historical';

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

  public focusedElement = 0;
  // // @Inputs
  // public regionSelect: any;
  // public plotTypeSelect: number = 0;

  // public dragGrouping: any = [
  //   { name: 'Data Categorization', id: 0, active: false, disabled: false },
  //   { name: 'Metric Comparison', id: 1, active: false, disabled: false }
  // ];


  //public fps$: Observable<DOMHighResTimeStamp> = new BehaviorSubject<any>([]);


  constructor(public router: Router, public dataService: DataService, @Inject(DOCUMENT) private readonly documentRef: Document) {

    const handleMouseWheel = null;

    window.addEventListener('mousewheel', handleMouseWheel, { passive: true });

    this.dataService.dashboardFacade.screenSelectedSubject$
      .subscribe((value: any) => {
        // console.log('screenSelectedSubject$ ', value)
      })

  }


  public ngAfterViewInit() {
    //console.log('****  ngAfterViewInit$ ',)
    this.setFocusedElement(0);
    //this.router.navigate(['/start-page']);
    //'flight-options'
    //'/passenger-details'
    // '/start-page'
    // manage-booking
  }
  // public openDetailsWindow() {
  //   console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.openDetailsFlag);
  //   this.openDetailsFlag = !this.openDetailsFlag;

  // }

  onThemeChange(scheme: any) {

    this.chartThemeSelect = this.isThemeChange ? 'dark' : 'light';
    console.log('onThemeChange ', this.chartThemeSelect, ' isThemeChange ', this.isThemeChange)
  }


  public setFocusedElement(idx: number) {
    console.log('setFocusedElement ', idx)
    if (idx === 0) {
      this.router.navigate(['flightCategories']);
    } else {
      this.router.navigate(['historical']);
    }
    this.focusedElement = idx;
  }

  public collapseQueryWindow() {
    //console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.toggleQueryVisible)
  }


  public toggleFrameRate() {
    this.frameRateCounterState = !this.frameRateCounterState;
  }

  ngOnInit() {
    this.router.navigate(['flightCategories']);
    // this.router.navigate(['/app', 'flightCategories']);
    // console.log('navigate To  ', '  ', this.toggleQueryVisible)
    //this.router.navigate(['/app']);
  }
  // View Net Dates Out or NDO nums
  // public onClickSetXaxisViewType(ev: any) {
  //   this.xAxisViewType = ev.values[0];
  // }

  // From Historical Events Monthly Availability Switch
  // public onToggleMonthlyAvailabilitySwitch(ev: any) {
  //   this.monthlyAvailabilityVisible = !this.monthlyAvailabilityVisible;
  // }

  // public toggle(event: MatSlideToggleChange) {
  //   console.log('toggle', event.checked);
  //   this.chartThemeSelect = scheme.values[0] ? 'dark' : 'light';
  //   this.useDefault = event.checked;
  // }

  // On Theme change Dark/Light


}
