import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './component/signin/signin.component';
import { SignupComponent } from './component/signup/signup.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AnalystsDashboardComponent } from './component/analysts-dashboard/analysts-dashboard.component';
import { SalesDashboardComponent } from './component/sales-dashboard/sales-dashboard.component';
import { OperationsDashboardComponent } from './component/operations-dashboard/operations-dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales', component: SalesDashboardComponent },
  { path: 'operations', component: OperationsDashboardComponent },
  { path: 'analyst', component: AnalystsDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
