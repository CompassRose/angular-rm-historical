
import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from '../config-data-service';
import { map, Observable, pairwise, scan, BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
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
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})


export class AppLayoutComponent implements OnInit {

  // For Historical Events
  public chartThemeSelect = 'dark';

  public toggleQueryVisible = true;

  public openCloseIcon: string = "box-arrow-left"

  public selectedScreen = 0;

  public isExpanded = false;
  // @Inputs
  public openDetailsFlag = false;

  // @Inputs
  public regionSelect: any;

  public plotTypeSelect: number = 0;

  public currentApplicationVersion = environment.appVersion;

  public frameRateCounterState = false;

  public isNdoChecked = true;

  public isThemeChange = true;

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

  constructor(public router: Router, public dataService: DataService, @Inject(DOCUMENT) private readonly documentRef: Document) {


    this.dataService.dashboardFacade.screenGroupSubject$
      .subscribe((response: any[]) => {
        if (response.length > 0) {
          console.log('screenGroupSubject$ ', response)

        }
      })

    //Error: NG04002: Cannot match any routes.URL Segment
    this.dataService.dashboardFacade.getBrushSelectedFlights()
      .subscribe((response: any[]) => {

        if (response.length > 0) {

        } else {
          this.openDetailsFlag = false;
        }

      })


    this.dataService.dashboardFacade.screenGroupSubject$.next(this.dataService.dashboardFacade.dragGrouping);

  }

  public ngOnInit(): void {
    console.log('APP Layout Component   ngOnInit ')
    this.router.navigate(['/flightCategories']);
    //this.router.navigate(['/app', 'flightCategories']);
  }


  public gotoFlight() {
    console.log('flightCategories ',)
    this.router.navigate(['/app', 'flightCategories']);
  }

  public gotoHistorical() {
    console.log('gotoHistorical ',)
    this.router.navigate(['/app', 'historical']);
  }

  public gotoTable() {
    console.log('gotoHworkbench',)
    this.router.navigate(['/app', 'workbench']);
  }


  public getProperIcon(): string {
    this.openCloseIcon = this.toggleQueryVisible ? "box-arrow-left" : "box-arrow-right";
    return this.openCloseIcon
  }


  public openDetailsWindow() {
    console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.openDetailsFlag);
    this.openDetailsFlag = !this.openDetailsFlag;

  }


  ///-------------------------------------------------

  public toggleFrameRate() {
    this.frameRateCounterState = !this.frameRateCounterState;
  }

}
