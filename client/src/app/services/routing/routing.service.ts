import { Injectable, Type } from '@angular/core';
import { Page } from '../../model/employee-login.model';
import { HomeComponent } from '../../components/home/home.component';
import { LoginComponent } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { EnrolmentComponent } from '../../components/enrolment/enrolment.component';
import { DetectComponent } from '../../components/detect/detect.component';
import { EnrolComponent } from '../../components/enrol/enrol.component';
import { AdminDashboardComponent } from '../../modules/admin/components/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { Route, Router } from '@angular/router';
import { LoginService } from '../../shared/services/login/login.service';
import { DashboardComponent } from '../../modules/admin/components/dashboard/dashboard.component';
import { AllEmployeesComponent } from '../../modules/admin/components/all-employees/all-employees.component';
import { EmployeeAttendanceRecordsComponent } from '../../modules/admin/components/employee-attendance-records/employee-attendance-records.component';
import { UpdateEmployeeDetailsComponent } from '../../modules/admin/components/update-employee-details/update-employee-details.component';
import { EmployeeLogRecordsComponent } from '../../modules/admin/components/employee-log-records/employee-log-records.component';
import { PageAccessComponent } from '../../modules/admin/components/page-access/page-access.component';
import { EmployeeStatusDetailsComponent } from '../../modules/admin/components/employee-status-details/employee-status-details.component';
import { EmployeeDetailComponent } from '../../modules/admin/components/employee-detail/employee-detail.component';
import { ChangePasswordComponent } from '../../modules/admin/components/change-password/change-password.component';
import { MisEntriesComponent } from '../../modules/admin/components/mis-entries/mis-entries.component';
import { MisEntriesListComponent } from '../../modules/admin/components/mis-entries-list/mis-entries-list.component';
import { AllTopEmployeesComponent } from '../../modules/admin/components/all-top-employees/all-top-employees.component';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private routes: Page[] = []
  // private componentsMap: { [key: string]: Type<any> } = {
  //   home: HomeComponent,
  //   Dashboard:DashboardComponent,
  //   Attendance:
  // }

  private routeMapping: { [key: string]: { path: string, component: any } } = {
    Dashboard: { path: 'dashboard', component: DashboardComponent },
    Employees: { path: 'employees', component: AllEmployeesComponent },
    WorkingHours: { path: 'employees-today-working', component: EmployeeAttendanceRecordsComponent },
    UpdateProfile: { path: 'update-employee-details/:id', component: UpdateEmployeeDetailsComponent },
    Logs: { path: 'log-records', component: EmployeeLogRecordsComponent },
    Permission: { path: 'page-access', component: PageAccessComponent },
    Attendance: { path: 'todays-attendance', component: EmployeeStatusDetailsComponent },
    Profile: { path: 'employee-detail/:id', component: EmployeeDetailComponent },
    UpdatePassword: { path: 'change-password', component: ChangePasswordComponent },
    MisEntry: { path: 'mis-entries', component: MisEntriesListComponent },
    MisEntrySummary: { path: 'mis-entries/:id/:date', component: MisEntriesComponent },
    EmployeeStatus: { path: "employee-status-details", component: EmployeeStatusDetailsComponent },
    AllTopEmployee: {path: "all-top-employees/:type", component:AllTopEmployeesComponent}
  };
  private defaultRoutes: Route[] = [
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
  ];

  constructor(private router: Router, private loginService: LoginService) { }


  initializeRoutes() {
    return new Promise<void>((resolve, reject) => {
      const user = localStorage.getItem('user');
      if (user) {
        const roleId = JSON.parse(user).roleId;
        if (roleId) {
          this.loginService.getRoutes(roleId).subscribe({
            next: (data) => {
              this.routes = data;
              const my = this.generateRoutes(data)
              this.router.resetConfig(my);
              resolve();
            },
            error: (e) => {
              this.setDefaultRoute();
              resolve();
            },
          });
        }
      } else {
        this.setDefaultRoute();
        resolve();
      }
    });
  }

  setDefaultRoute() {
    this.router.resetConfig([
      ...this.defaultRoutes,
      {
        path: 'ats', component: AdminDashboardComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
      },
      { path: '**', component: NotFoundComponent },
    ]);
  }

  setRoutes(pageRoutes: Page[]) {
    this.router.resetConfig(this.generateRoutes(pageRoutes));
  }

  getRoutes() {
    return this.routes;
  }

  generateRoutes(pageList: Page[]) {
    const userRoutes = pageList.map((r) => ({
      path: this.routeMapping[r.pageTitle].path,
      component: this.routeMapping[r.pageTitle].component || NotFoundComponent,
    }));
    const updatedRoutes = [...this.defaultRoutes, {
      path: 'ats', component: AdminDashboardComponent,
      children: [
        ...userRoutes
      ]
    }];
    updatedRoutes.push({ path: '**', component: NotFoundComponent });
    return updatedRoutes;
  }
  // private getComponent(pageTitle: string): Type<any> | undefined {
  //   return this.componentsMap[pageTitle.toLowerCase()];
  // }

}
