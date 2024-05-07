import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { TableSelectorComponent } from './table-selector/table-selector.component';
import { MetricComparisonComponent } from './metric-comparison-chart/metric-comparison-chart.component';
import { FlightCategorizationComponent } from './flight-categorization/flight-categorization.component';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';

const routes: Routes = [
  { path: '', redirectTo: 'start-page', pathMatch: 'full' },
  { path: 'start-page', component: AppLayoutComponent },
  { path: 'flightCategories', component: FlightCategorizationComponent },
  { path: 'workbench', component: TableSelectorComponent },
  { path: 'historical', component: MetricComparisonComponent },
  { path: 'analytics', component: InventoryTableComponent },
];




// const routes2: Routes = [
//   {
//     path: 'app',
//     component: AppLayoutComponent,
//     children: [
//       { path: 'flightCategories', component: FlightCategorizationComponent },
//       { path: 'workbench', component: TableSelectorComponent },
//       { path: 'historical', component: MetricComparisonComponent },
//       { path: '', redirectTo: '/app', pathMatch: 'full' }
//     ]
//   }
// ];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})

// @NgModule({
//   imports: [
//     RouterModule.forRoot(
//       routes,
//       { useHash: true, onSameUrlNavigation: 'reload' }
//     )
//   ],
//   exports: [RouterModule]
// })

export class AppRoutingModule { }
