import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
    component: UserDashboardComponent,
    children: [
      { path: '', redirectTo: '/user/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

