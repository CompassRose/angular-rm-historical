import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContinousPricingComponent } from './pricing-grid/grid.component';


const routes: Routes = [

  {
    path: 'grid/:id',
    component: ContinousPricingComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
