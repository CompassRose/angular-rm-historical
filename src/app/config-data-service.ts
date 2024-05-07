import { Injectable } from '@angular/core';
import { DashboardFacade } from './dashboard.facade';

@Injectable()
export class DataService {

  private readonly table_url: string = 'TableRepo/Table';
  private readonly inventoryConfig_url: string = 'InventoryConfig';
  private readonly flightCategorization_url: string = 'tablerepo/table/__WebCategorization1a';
  private readonly flightscore_url = 'tablerepo/AllColumnsByModelType';
  private readonly migrateUpTables_url: string = 'tablerepo/migrateup/__WebCategorization1a';

  constructor(public dashboardFacade: DashboardFacade) {


    this.dashboardFacade.loadCategorizedData('EURCANARY');
    this.dashboardFacade.loadAirportCodes();
    this.dashboardFacade.getMyWorld();
    this.dashboardFacade.loadClusteredData();

    this.dashboardFacade.loadProgressiveData();
    this.dashboardFacade.loadCompetitiveFareData();

    // this.dashboardFacade.loadMonthlyAvailableData('MonthlyAvailable_URL');
    // this.dashboardFacade.loadMonthlyAvailableData('MonthlyAvailable1_URL');
    // this.dashboardFacade.loadMonthlyAvailableData('MonthlyAvailable7_URL');
    // this.dashboardFacade.loadMonthlyAvailableData('MonthlyAvailable52_URL');

    // Mock Values
    this.dashboardFacade.loadColumns(this.flightscore_url);
    ///this.dashboardFacade.loadFlightAnalytics();
    this.dashboardFacade.loadInventory();

  }
}
