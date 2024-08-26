import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
