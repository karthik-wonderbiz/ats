import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { DetectComponent } from './components/detect/detect.component';
import { EnrolComponent } from './components/enrol/enrol.component';
import { EnrolmentComponent } from './components/enrolment/enrolment.component';
import { AdminDashboardComponent } from './modules/admin/components/admin-dashboard/admin-dashboard.component';
import { ContactComponent } from './modules/admin/components/contact/contact.component';
import { AboutComponent } from './modules/admin/components/about/about.component';
import { DashboardComponent } from './modules/admin/components/dashboard/dashboard.component';
import { EmployeeDetailComponent } from './modules/admin/components/employee-detail/employee-detail.component';
import { UpdateEmployeeDetailsComponent } from './modules/admin/components/update-employee-details/update-employee-details.component';
import { EmployeeStatusDetailsComponent } from './modules/admin/components/employee-status-details/employee-status-details.component';
import { EmployeeAttendanceRecordsComponent } from './modules/admin/components/employee-attendance-records/employee-attendance-records.component';
import { AllEmployeesComponent } from './modules/admin/components/all-employees/all-employees.component';
import { AllTopEmployeesComponent } from './modules/admin/components/all-top-employees/all-top-employees.component';
import { EmployeeLogRecordsComponent } from './modules/admin/components/employee-log-records/employee-log-records.component';
import { PageAccessComponent } from './modules/admin/components/page-access/page-access.component';
import { ChangePasswordComponent } from './modules/admin/components/change-password/change-password.component';
import { MisEntriesComponent } from './modules/admin/components/mis-entries/mis-entries.component';
import { MisEntriesListComponent } from './modules/admin/components/mis-entries-list/mis-entries-list.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },

  {
    path: 'enrolment', component: EnrolmentComponent,
    children: [
      { path: '', redirectTo: '/enrolment/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'home/:userId', component: HomeComponent },
      { path: 'detect', component: DetectComponent },
      { path: 'enrol', component: EnrolComponent },
    ]
  },

  {
    path: 'admin', component: AdminDashboardComponent,
    children: [
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: AboutComponent },
      { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee-detail/:id', component: EmployeeDetailComponent },
      { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent, canDeactivate: [UnsavedChangesGuard], },
      { path: 'employee-status-details', component: EmployeeStatusDetailsComponent },
      { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
      { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
      { path: 'employees', component: AllEmployeesComponent },
      { path: 'log-records', component: EmployeeLogRecordsComponent },
      { path: 'all-top-employees/:type', component: AllTopEmployeesComponent },
      { path: 'page-access', component: PageAccessComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      {path:'mis-entries', component: MisEntriesListComponent},
      {path:'mis-entries/:id/:date', component: MisEntriesComponent}
    ],

  },

  {
    path: 'user', component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: '/user/log-records', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee-detail/:id', component: EmployeeDetailComponent },
      { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent },
      { path: 'employee-status-details', component: EmployeeStatusDetailsComponent },
      { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
      { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
      { path: 'employees', component: AllEmployeesComponent },
      { path: 'log-records', component: EmployeeLogRecordsComponent },
      { path: 'all-top-employees/:type', component: AllTopEmployeesComponent },
      { path: 'page-access', component: PageAccessComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ]
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
