import { createComponent, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AboutComponent } from './components/about/about.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeAttendanceRecordsComponent } from './components/employee-attendance-records/employee-attendance-records.component';
import { EmployeeStatusDetailsComponent } from './components/employee-status-details/employee-status-details.component';
import { EmployeeStatusComponent } from './components/employee-status/employee-status.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { BarComponent } from './components/generic-components/bar/bar.component';
import { CalendarComponent } from './components/generic-components/calendar/calendar.component';
import { EmployeeDetailComponent } from './components/generic-components/employee-detail/employee-detail.component';
import { LineComponent } from './components/generic-components/line/line.component';
import { PieComponent } from './components/generic-components/pie/pie.component';
import { TableWithTabsComponent } from './components/generic-components/table-with-tabs/table-with-tabs.component';
import { TableComponent } from './components/generic-components/table/table.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopEmployeesComponent } from './components/top-employees/top-employees.component';
import { EmployeeLogRecordsComponent } from './components/employee-log-records/employee-log-records.component';
import { AllEmployeesComponent } from './components/all-employees/all-employees.component';
import { AllTopEmployeesComponent } from './components/all-top-employees/all-top-employees.component';
import { UpdateEmployeeDetailsComponent } from './components/update-employee-details/update-employee-details.component';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
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
    LoaderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule,
    BaseChartDirective,
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [provideCharts(withDefaultRegisterables()), provideHttpClient()],

})
export class AdminModule { }
