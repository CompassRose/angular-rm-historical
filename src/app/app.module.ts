import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetricComparisonComponent } from './metric-comparison-chart/metric-comparison-chart.component';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component'
import { DataService } from './config-data-service';
import { DashboardFacade } from './dashboard.facade';
import { DashboardState } from './dashboard.state';
import { SetQueryComponent } from './set-query/set-query.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WorldMapComponent } from './world-map/world-map.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DetailsComponent } from './details-container/details-container.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface


@NgModule({
  declarations: [
    AppComponent,
    SetQueryComponent,
    MetricComparisonComponent,
    WorldMapComponent,
    DetailsComponent,
    ScatterChartComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    NgSelectModule,
    AgGridAngular,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [DataService, DashboardFacade, DashboardState],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
