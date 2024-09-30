import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MetricComparisonComponent } from './metric-comparison-chart/metric-comparison-chart.component';
import { FlightCategorizationComponent } from './flight-categorization/flight-categorization.component';


const routes: Routes = [
  { path: '', redirectTo: 'flightCategories', pathMatch: 'full' },
  { path: 'flightCategories', component: FlightCategorizationComponent },
  { path: 'historical', component: MetricComparisonComponent },
];




@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})


export class AppRoutingModule { }
