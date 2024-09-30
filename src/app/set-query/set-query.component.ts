import { Component, Output, AfterViewInit, OnInit, EventEmitter, Input } from '@angular/core';
import { DataService } from '../config-data-service';
import { plotListLeftOptions, cabinSelections, plotListLeftOptionsObject, departureDateOptions, marketAnalysisOptions } from '../dashboard-constants';
import { QueryItems, RegionList } from '../models/dashboard.model';
import { arrows } from '../dashboard-constants';


@Component({
  selector: 'set-query',
  templateUrl: './set-query.component.html',
  styleUrls: ['./set-query.component.scss']
})

export class SetQueryComponent implements OnInit {

  public selectedPlotType: number = 0;

  public selectedDepartureDate: string[] = [];
  public regionSpecificDestinations: string[] = [];
  public selectedDestinations: string[] = [];
  public ndoRangeOptions: any[] = [];

  public plotListLeft = plotListLeftOptions;

  public plotListObject = plotListLeftOptionsObject;

  public plotListObjectSelected;

  public selectedRegions: RegionList[] = [];

  public selectableRegionList: RegionList[] = []

  public departureDateOptions = departureDateOptions;
  public metrics = cabinSelections;


  public openArrows = arrows;
  public collapsedInputState = false;

  public queryObj: QueryItems = {
    regions: [],
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

  constructor(public dataService: DataService) {


    // initialize reactive forms
    // this.dateByRegionOptions = fb.group({
    //   region: [],
    //   ndoRange: [],
    //   plotType: this.plotListLeft[0]
    // });


  }


  public setScreen(idx: number) {

    //console.log('setScreen ', idx, ' dragGrouping ', this.dataService.dashboardFacade.dragGrouping[idx]);

    this.plotListLeft = this.dataService.dashboardFacade.dragGrouping[idx].plotTypeOptions;

    //console.log('this.plotListLeft ', this.plotListLeft)
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

    if (JSON.parse(window.localStorage.getItem('regionList'))) {

      const getStorageValues = JSON.parse(window.localStorage.getItem('regionList'));

      this.selectedRegions = getStorageValues;

      //console.log('getStorageValues  ', getStorageValues)

    } else {

      this.selectedRegions = [{ state: true, value: 'ESCANARY' }];
      localStorage.setItem('regionList', JSON.stringify(this.selectedRegions));

    }

    //this.plotListObject.forEach(item => item.state = false);

    if (JSON.parse(window.localStorage.getItem('plotType'))) {

      this.plotListObject = JSON.parse(window.localStorage.getItem('plotType'));

    } else {
      this.plotListObject[0].state = true;
      localStorage.setItem('plotType', JSON.stringify(this.plotListObject));
    }
    this.plotListObject.forEach((item, i) => {
      if (item.state) {
        this.selectedPlotType = i;
      }
    })



    //console.log('ngOnInit ngOnInit ngOnInit ngOnInit ngOnInit ngOnInit ngOnInit\n\n\n\n\n')
    this.dataService.dashboardFacade.getplotType()
      .subscribe((response: any) => {
        // console.log('getplotType  ', response)
        if (response) {
          this.plotListObjectSelected = response;
        }
      })


    this.dataService.dashboardFacade.getGlobalRegionObjects()
      .subscribe((response: any[]) => {

        if (response.length > 0) {

          let getStorageValues: RegionList[] = [];
          this.selectableRegionList = response;
          //console.log('this.selectableRegionList  ', this.selectableRegionList)
          this.selectableRegionList.forEach((region: RegionList) => {
            const matchingItem = this.selectedRegions.find(item => item.value === region.value);
            if (matchingItem) {
              region.state = matchingItem.state;
            } else {
              region.state = false;
            }
          });
        }
      });



    // @ts-ignore
    // const getStorageValues: any[] = JSON.parse(window.localStorage.getItem('chartValues'));
    // this.selectedPlotType = getStorageValues[1];

    const sendRegionQuery = this.setRegionStringArray(this.selectedRegions);
    //console.log('sendRegionQuery ', sendRegionQuery)

    this.queryObj = {
      regions: sendRegionQuery,
      plotType: 0,
      ndoList: []
    }

    //console.log('queryObj ', this.queryObj)
    // console.log('this.queryObj ', this.queryObj)
    this.dataService.dashboardFacade.sendQueryItems(this.queryObj);
  }



  public logAndReturnItem(item: any) {
    //console.log('logAndReturnItem ', item);
    return item;
  }




  private setRegionStringArray(regions: RegionList[]): string[] {
    const sendRegionQuery = [];

    this.selectedRegions.forEach((region: RegionList) => {
      sendRegionQuery.push(region.value)
    })
    return sendRegionQuery
  }




  // Called from Save button
  public saveSelections() {

    console.log('saveSelections this.queryObj ', this.selectedPlotType, ' this.selectedRegions ', this.selectedRegions)
    const sendRegionQuery = this.setRegionStringArray(this.selectedRegions);

    this.queryObj = {
      regions: sendRegionQuery,
      plotType: this.selectedPlotType,
      ndoList: []
    }
    console.log('saveSelections sendRegionQuery ', sendRegionQuery)

    this.dataService.dashboardFacade.setGlobalRegionObjects(sendRegionQuery);

    this.dataService.dashboardFacade.setplotTypes(this.selectedPlotType);

    setTimeout(() => {

      localStorage.setItem('chartValues', JSON.stringify(Array.from([this.selectedRegions, this.plotListObjectSelected])));
      this.dataService.dashboardFacade.sendQueryItems(this.queryObj);
    }, 0);

  }



  // From select drop down
  public onPlotTypeSelect(item: any) {

    console.log('onPlotTypeSelect ', item)

    const index = this.plotListObject.indexOf(item);

    this.plotListObject.forEach(item => item.state = false);

    this.plotListObject[index].state = !this.plotListObject[index].state;

    console.log('onPlotTypeSelect ', this.plotListObject, ' index ', index)

    this.plotListObjectSelected = index;

    this.queryObj.plotType = item

    this.selectedPlotType = index;

    localStorage.setItem('plotType', JSON.stringify(this.plotListObject));

  }




  public onRegionSelect(item: any) {

    console.log(' ***********  onRegionSelect ', item)

    //if (this.selectedRegions.length < 4) {

    const index = this.selectableRegionList.indexOf(item);

    this.selectableRegionList[index].state = !this.selectableRegionList[index].state;

    this.selectedRegions = [...this.selectableRegionList.filter((region: RegionList) => region.state === true)];

    console.log('\n\n\n *******index ', index, ' [][] ', this.selectedRegions)

    localStorage.setItem('regionList', JSON.stringify(this.selectedRegions));
    // }

  }

  public onNdoSelect(ev: any) { }

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
