import { Component, OnInit } from '@angular/core';
import { DashboardFacade } from '../dashboard.facade';
import { TableValues } from '../models/dashboard.model';

export interface TableView {
  name: string;
  dataSourceType: string;
}
@Component({
  selector: 'table-selector',
  templateUrl: './table-selector.component.html',
  styleUrls: ['./table-selector.component.scss']
})

export class TableSelectorComponent implements OnInit {

  public tableCollection: TableView[] = [];

  constructor(public dashboardFacade: DashboardFacade) {
    //this.loadTables();
  }

  ngOnInit(): void {

    this.dashboardFacade.getTableApiData()
      .subscribe((response: TableValues[]) => {
        console.log('d ', response)
        if (response.length > 0) {
          this.tableCollection = response.map((d, i) => {

            return { name: d.name, dataSourceType: d.dataSourceType === "SourceTable" ? 'Src' : 'Map' };
          })
        }
      })
  }

  public loadTables() {
    this.dashboardFacade.loadTableApiData();
  }

  public setTable(item) {
    this.dashboardFacade.loadColumnsApiData(item);
  }

}
