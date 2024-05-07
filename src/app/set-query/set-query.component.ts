import { Component, Output, AfterViewInit, OnInit, EventEmitter, Input } from '@angular/core';
import { DataService } from '../config-data-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ndoDaysOut, plotListLeftOptions, cabinSelections, nDoDropdownSettings, dropdownSettings, dropdownSettingsSingle, departureDateOptions, marketAnalysisOptions } from '../dashboard-constants';
import { QueryItems } from '../models/dashboard.model';
import { arrows } from '../dashboard-constants';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'set-query',
  templateUrl: './set-query.component.html',
  styleUrls: ['./set-query.component.scss']
})

export class SetQueryComponent implements OnInit {

  public dateByRegionOptions: FormGroup;
  //public dateByRegionSaved: FormGroup;

  public selectedPlotType: number = 0;

  public selectedDepartureDate: string[] = [];
  public regionSpecificDestinations: string[] = [];
  public selectedDestinations: string[] = [];
  public ndoRangeOptions: any[] = [];

  public plotListLeft = plotListLeftOptions;

  public departureDateOptions = departureDateOptions;
  public metrics = cabinSelections;
  public nDoDropdownSettings = nDoDropdownSettings;
  public dropdownSettings = dropdownSettings;
  public dropdownSettingsSingle = dropdownSettingsSingle

  public openArrows = arrows;
  public collapsedInputState = false;

  public queryObj: QueryItems = {
    regions: ['ESCANARY'],
    plotType: 0,
    ndoList: []
  };

  @Input()
  set collapseIndfluences(state: boolean) {
    this.collapsedInputState = !this.collapsedInputState;
    console.log('this.collapsedInputState ', this.collapsedInputState)
  }

  @Output()
  public updateDetailRows: EventEmitter<any> = new EventEmitter();

  public regionList: any[] = [];

  public marketAnalysisOption = marketAnalysisOptions;

  constructor(public fb: FormBuilder, public dataService: DataService) {


    // initialize reactive forms
    this.dateByRegionOptions = fb.group({
      region: [],
      ndoRange: [],
      plotType: this.plotListLeft[0]
    });


    // this.dateByRegionSaved = fb.group({
    //   region: [],
    //   ndoRange: [],
    //   plotType: 0
    // });

  }


  public setScreen(idx: number) {

    console.log('setScreen ', idx, ' dragGrouping ', this.dataService.dashboardFacade.dragGrouping[idx]);


    this.plotListLeft = this.dataService.dashboardFacade.dragGrouping[idx].plotTypeOptions;
    console.log('this.plotListLeft ', this.plotListLeft)
    this.dataService.dashboardFacade.selectedScreen = idx;
    this.dataService.dashboardFacade.screenSelectedSubject$.next(idx)
    // this.dataService.dashboardFacade.dragGrouping[idx];
  }


  public collapseQueryItems() {
    this.collapsedInputState = !this.collapsedInputState;
    //console.log('this.collapsedInputState ', this.collapsedInputState)
    this.updateDetailRows.emit(this.collapsedInputState)
  }


  ngOnInit(): void {

    // const tempCollection = JSON.parse(window.localStorage.getItem('chartValues'));

    // @ts-ignore
    if (JSON.parse(window.localStorage.getItem('chartValues'))) {

      // @ts-ignore
      const getStorageValues: any[] = JSON.parse(window.localStorage.getItem('chartValues'));

      this.selectedPlotType = getStorageValues[1];

      this.queryObj = {
        regions: getStorageValues[0],
        plotType: getStorageValues[1],
        ndoList: []
      }
    } else {

      this.queryObj = {
        regions: ['ESCANARY'],
        plotType: 0,
        ndoList: []
      }
    }
    // console.log('plotListLeft ', this.plotListLeft)
    // console.log('this.queryObj ', this.queryObj)

    this.dataService.dashboardFacade.sendQueryItems(this.queryObj);


    // this.dataService.dashboardFacade.getplotType()
    //   .subscribe(types => {
    //     console.log('\n\n types ', types)
    //   })

    this.onChanges();
    this.setFormValues();

    this.dataService.dashboardFacade.getRegionDestinationList()
      .subscribe((response: any[]) => {
        // console.log('response ', response)
        this.regionSpecificDestinations = response;
        this.ndoRangeOptions = [];

      })
  }


  // Sets initial form state
  private setFormValues() {

    // console.log('[plotListLeftOptions[this.queryObj.plotType].name] XXXXXXXXXXXXXX ', ' plotType ', this.queryObj.plotType, ' plotListLeftOptions ', this.plotListLeft[this.queryObj.plotType])

    this.dateByRegionOptions.setValue({
      region: this.queryObj.regions,
      plotType: [plotListLeftOptions[this.queryObj.plotType]],
      ndoRange: []
    });

    //console.log(' XXXXXXXXXXXXXX ', ' plotType ', this.queryObj.plotType, ' plotListLeftOptions ', this.plotListLeft[this.queryObj.plotType])

    // if (this.dateByRegionSaved.value.region === null) {
    //   this.dateByRegionSaved = cloneDeep(this.dateByRegionOptions);
    // }
  }


  // onChange for Region only
  public onChanges() {

    this.dateByRegionOptions.valueChanges.subscribe(val => {

      if (this.dateByRegionOptions.value !== undefined) {

        this.queryObj.regions = val.region;
        this.queryObj.ndoList = [];
        //console.log('dateByRegionOptions ', this.queryObj)
      }
    });
  }

  // Called from Save button
  public saveSelections() {
    //console.log('saveSelections this.queryObj ', this.queryObj.plotType)

    this.dateByRegionOptions.setValue({
      region: this.queryObj.regions,
      plotType: [plotListLeftOptions[this.queryObj.plotType]],
      ndoRange: []
    });

    //this.dateByRegionSaved = cloneDeep(this.dateByRegionOptions);

    setTimeout(() => {

      localStorage.setItem('chartValues', JSON.stringify(Array.from([this.queryObj.regions, this.queryObj.plotType, this.queryObj.ndoList])));
      this.dataService.dashboardFacade.sendQueryItems(this.queryObj);
    }, 0);

  }

  // NON- destructive return form values to saved versions and close
  // public cancelEditMode() {
  //   this.dateByRegionOptions.setValue({
  //     region: this.dateByRegionSaved.value.region,
  //     plotType: this.dateByRegionSaved.value.plotType,
  //     ndoRange: []
  //   });
  // }


  // From select drop down
  public onPlotTypeSelect(ev: any) {

    const idx = this.plotListLeft.findIndex(res => res === ev);
    console.log('onPlotTypeSelect ', ev, ' origin ', origin)
    this.queryObj.plotType = idx;
    this.selectedPlotType = idx;
  }


  public onNdoSelect(ev: any) { }

  public onNdoDeSelect(ev: any) { }

  public onRegionDeSelect(item: any) {
  }


  public onRegionSelect(item: any) {
  }

  public closeSelected(idx: any) {
    // console.log('closeSelected ', idx)
  }

  public onItemSelect(item: any) {
    //  console.log('onItemSelect ', item)
    //this.queryObj.plotType = item.item_id;
  }

  public onItemDeSelect(item: any) { }

  public onSelectAll(items: any) { }

}
