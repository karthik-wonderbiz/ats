import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { EnrolComponent } from './components/enrol/enrol.component';
import { DetectComponent } from './components/detect/detect.component';
import { MyBtnComponent } from './components/my-btn/my-btn.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToastComponent } from './components/toast/toast.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { EnrolmentComponent } from './components/enrolment/enrolment.component';
import { AboutComponent } from './modules/admin/components/about/about.component';
import { AllEmployeesComponent } from './modules/admin/components/all-employees/all-employees.component';
import { AllTopEmployeesComponent } from './modules/admin/components/all-top-employees/all-top-employees.component';
import { ContactComponent } from './modules/admin/components/contact/contact.component';
import { DashboardComponent } from './modules/admin/components/dashboard/dashboard.component';
import { EmployeeAttendanceRecordsComponent } from './modules/admin/components/employee-attendance-records/employee-attendance-records.component';
import { EmployeeLogRecordsComponent } from './modules/admin/components/employee-log-records/employee-log-records.component';
import { EmployeeStatusDetailsComponent } from './modules/admin/components/employee-status-details/employee-status-details.component';
import { EmployeeStatusComponent } from './modules/admin/components/employee-status/employee-status.component';
import { BarComponent } from './modules/admin/components/generic-components/bar/bar.component';
import { CalendarComponent } from './modules/admin/components/generic-components/calendar/calendar.component';
import { EmployeeDetailComponent } from './modules/admin/components/generic-components/employee-detail/employee-detail.component';
import { LineComponent } from './modules/admin/components/generic-components/line/line.component';
import { PieComponent } from './modules/admin/components/generic-components/pie/pie.component';
import { TableWithTabsComponent } from './modules/admin/components/generic-components/table-with-tabs/table-with-tabs.component';
import { TableComponent } from './modules/admin/components/generic-components/table/table.component';
import { LoaderComponent } from './modules/admin/components/loader/loader.component';
import { TopEmployeesComponent } from './modules/admin/components/top-employees/top-employees.component';
import { UpdateEmployeeDetailsComponent } from './modules/admin/components/update-employee-details/update-employee-details.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SectionComponent } from './shared/components/section/section.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AdminDashboardComponent } from './modules/admin/components/admin-dashboard/admin-dashboard.component';
import { PageAccessComponent } from './modules/admin/components/page-access/page-access.component';
import { ChangePasswordComponent } from './modules/admin/components/change-password/change-password.component';
import { UnknownProfilesComponent } from './components/unknown-profiles/unknown-profiles.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NotFoundComponent,
    NavComponent,
    HomeComponent,
    EnrolComponent,
    DetectComponent,
    MyBtnComponent,
    ProfileComponent,
    ToastComponent,
    WebcamComponent,
    ProfileListComponent,
    EnrolmentComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    PieComponent,
    BarComponent,
    LineComponent,
    TableComponent,
    CalendarComponent,
    DashboardComponent,
    EmployeeStatusComponent,
    EmployeeStatusDetailsComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    SectionComponent,
    TopEmployeesComponent,
    TableWithTabsComponent,
    EmployeeDetailComponent,
    EmployeeAttendanceRecordsComponent,
    EmployeeLogRecordsComponent,
    AllEmployeesComponent,
    AllTopEmployeesComponent,
    UpdateEmployeeDetailsComponent,
    LoaderComponent,
    AdminDashboardComponent,
    PageAccessComponent,
    ChangePasswordComponent,
    UnknownProfilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    CommonModule,
    BaseChartDirective,
    FullCalendarModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
  ],
  providers: [provideCharts(withDefaultRegisterables()), provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
