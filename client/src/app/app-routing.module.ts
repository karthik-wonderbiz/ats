import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
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
import { EmployeeDetailComponent } from './modules/admin/components/generic-components/employee-detail/employee-detail.component';
import { UpdateEmployeeDetailsComponent } from './modules/admin/components/update-employee-details/update-employee-details.component';
import { EmployeeStatusDetailsComponent } from './modules/admin/components/employee-status-details/employee-status-details.component';
import { EmployeeAttendanceRecordsComponent } from './modules/admin/components/employee-attendance-records/employee-attendance-records.component';
import { AllEmployeesComponent } from './modules/admin/components/all-employees/all-employees.component';
import { AllTopEmployeesComponent } from './modules/admin/components/all-top-employees/all-top-employees.component';
import { EmployeeLogRecordsComponent } from './modules/admin/components/employee-log-records/employee-log-records.component';
import { PageAccessComponent } from './modules/admin/components/page-access/page-access.component';
import { ChangePasswordComponent } from './modules/admin/components/change-password/change-password.component';
import { RouteService } from './services/route/route.service';
import { ProfileComponent } from './components/profile/profile.component';

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

  // {
  //   path: 'admin' ,  component: AdminDashboardComponent,
  //   children: [
  //     { path: 'contact', component: ContactComponent },
  //     { path: 'about', component: AboutComponent },
  //     { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'employee-detail/:id', component: EmployeeDetailComponent },
  //     { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent },
  //     { path: 'employee-status-details', component: EmployeeStatusDetailsComponent },
  //     { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
  //     { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
  //     { path: 'employees', component: AllEmployeesComponent },
  //     { path: 'log-records', component: EmployeeLogRecordsComponent },
  //     { path: 'all-top-employees/:type', component: AllTopEmployeesComponent },
  //     { path: 'page-access', component: PageAccessComponent },
  //     { path: 'change-password', component: ChangePasswordComponent },
  //   ],

  // },

  // {
  //   path: 'user', component: AdminDashboardComponent,
  //   children: [
  //     { path: '', redirectTo: '/user/log-records', pathMatch: 'full' },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'employee-detail/:id', component: EmployeeDetailComponent },
  //     { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent },
  //     { path: 'employee-status-details', component: EmployeeStatusDetailsComponent },
  //     { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
  //     { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
  //     { path: 'employees', component: AllEmployeesComponent },
  //     { path: 'log-records', component: EmployeeLogRecordsComponent },
  //     { path: 'all-top-employees/:type', component: AllTopEmployeesComponent },
  //     { path: 'page-access', component: PageAccessComponent },
  //     { path: 'change-password', component: ChangePasswordComponent },
  //   ]
  // },

  // { path: 'admin', children: [] },
  // { path: 'employee', children: [] },

  {
    path: 'ats', component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  { path: '**', component: NotFoundComponent },
];

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'sign-up', component: SignUpComponent },
//   // Default route for dashboard or user-specific routes
//   { path: 'dashboard', component: AdminDashboardComponent }, // or your main dashboard component
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {
  constructor(private router: Router) { }

  public loadUserRoutes(): void {
    const user = JSON.parse(localStorage.getItem('loginData') || '{}');
    if (user && user.pageList) {
      const atsRoute = this.router.config.find(route => route.path === 'ats');
      console.log(atsRoute)
      if (atsRoute && atsRoute.children) {
        // Clear existing child routes if necessary
        atsRoute.children = [
          { path: '', redirectTo: user.roleId === 2 ? 'dashboard' : 'log-records', pathMatch: 'full' }
        ];
  
        user.pageList.forEach((page: any) => {
          if (page.isActive) {
            const childRoute = this.getRouteByTitle(page.pageTitle);
            atsRoute.children?.push(childRoute);
          }
        });
  
        // Reset the router's navigation with the updated routes
        this.router.resetConfig(this.router.config);
      }
    }
  }
  
  
  private getRouteByTitle(title: string): any {
    const routeMapping: { [key: string]: { path: string, component: any } } = {
      'Dashboard': { path: 'dashboard', component: DashboardComponent },
      'Employees': { path: 'employees', component: AllEmployeesComponent },
      'WorkingHours': { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
      'UpdateProfile': { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent },
      'Logs': { path: 'log-records', component: EmployeeLogRecordsComponent },
      'Permissions': { path: 'page-access', component: PageAccessComponent },
      'Attendance': { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
      'Profile': { path: 'employee-detail/:id', component: EmployeeDetailComponent },
      'UpdatePassword': { path: 'change-password', component: ChangePasswordComponent },
    };
  
    return routeMapping[title] || { path: 'login', component: LoginComponent };
  }
}