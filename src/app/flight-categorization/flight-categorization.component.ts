import { Component, Inject } from '@angular/core';
import { DataService } from '../config-data-service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-flight-categorization',
  templateUrl: './flight-categorization.component.html',
  styleUrls: ['./flight-categorization.component.scss']
})
export class FlightCategorizationComponent {

  public toggleQueryVisible = true;

  public openCloseIcon: string = "box-arrow-left"

  public selectedScreen = 0;

  public isExpanded = false;
  // @Inputs
  public openDetailsFlag = false;

  // @Inputs
  public regionSelect: any;

  public plotTypeSelect: number = 0;
  constructor(public dataService: DataService, @Inject(DOCUMENT) private readonly documentRef: Document) {

    this.dataService.dashboardFacade.screenSelectedSubject$
      .subscribe((value: any) => {
        console.log('screenSelectedSubject$ ', value)
      })


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
        console.log('APP Component   response ', response)
      })


    this.dataService.dashboardFacade.screenGroupSubject$.next(this.dataService.dashboardFacade.dragGrouping);

  }



  public getProperIcon(): string {
    this.openCloseIcon = this.toggleQueryVisible ? "box-arrow-left" : "box-arrow-right";
    return this.openCloseIcon
  }


  public openDetailsWindow() {
    console.log('collapseQueryWindow ', ' toggleQueryVisible ', this.openDetailsFlag);
    this.openDetailsFlag = !this.openDetailsFlag;

  }

}
