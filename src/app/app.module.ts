import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetricComparisonComponent } from './metric-comparison-chart/metric-comparison-chart.component';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';
import { DataService } from './config-data-service';
import { DashboardFacade } from './dashboard.facade';
import { DashboardState } from './dashboard.state';
import { SetQueryComponent } from './set-query/set-query.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DetailsComponent } from './details-container/details-container.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AgGridAngular } from 'ag-grid-angular';
//import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { ScatterChartClusterComponent } from './scatter-chart-cluster/scatter-chart-cluster.component';
import { AppRoutingModule } from './app-routing.module';
import { FlightCategorizationComponent } from './flight-categorization/flight-categorization.component';
import { MetricDataService } from './services/metric-comparison.service';

@NgModule({
  declarations: [
    MetricComparisonComponent,
    AppComponent,
    SetQueryComponent,
    WorldMapComponent,
    DetailsComponent,
    ScatterChartComponent,
    ScatterChartClusterComponent,
    FlightCategorizationComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatSlideToggleModule,
    NgSelectModule,
    AgGridAngular,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [DataService, DashboardFacade, DashboardState, MetricDataService],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
