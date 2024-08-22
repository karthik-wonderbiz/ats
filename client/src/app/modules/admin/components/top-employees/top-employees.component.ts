import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TableWithTabsComponent } from '../generic-components/table-with-tabs/table-with-tabs.component';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-employees',
  templateUrl: './top-employees.component.html',
  styleUrls: ['./top-employees.component.css']
})

export class TopEmployeesComponent implements OnInit {
  @ViewChild('hoursTable') hoursTable: TableWithTabsComponent | undefined;

  top5EmployeeIn: any[] = [];
  top5EmployeeOut: any[] = [];
  allEmployeesInData: any[] = [];
  allEmployeesOutData: any[] = [];
  columns1 = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];
  columns2 = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];
  columns3 = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];
  columns4 = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];
  tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All-Time'];
  tabNames = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];

  isTabChanged: boolean = false;

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const startDate = '';
    const endDate = '';
    const reportType = 'Daily';
    this.loadEmployeeInData(startDate, endDate, reportType);
    this.loadEmployeeOutData(startDate, endDate, reportType);
    this.subscribeToItemUpdates();
  }

  loadEmployeeInData(startDate: string, endDate: string, reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours().subscribe((data) => {
      this.top5EmployeeIn = data.slice(0, 5);
      this.allEmployeesInData = data;
      this.isTabChanged=false;
      console.log(`Top 5 Employee Data in for ${reportType}:`, this.top5EmployeeIn);
    });
  }

  loadEmployeeOutData(startDate: string, endDate: string, reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours().subscribe((data) => {
      this.top5EmployeeOut = data.slice(0, 5);
      this.allEmployeesOutData = data;
      this.isTabChanged=false;
      console.log(`Top 5 Employee out Data for ${reportType}:`, this.top5EmployeeOut);
    });
  }


  // Method called when a tab is changed
  onTabChanged(reportType: string): void {
    const startDate = ''; 
    const endDate = '';
    this.isTabChanged = true;
    this.loadEmployeeInData(startDate, endDate, reportType);
  }

  // Subscribe to SignalR updates
  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        const activeTab = this.hoursTable?.activeTab || 'Daily'; // Get the currently active tab
        this.loadEmployeeInData('', '', activeTab); // Reload data for the active tab
        this.loadEmployeeOutData('', '', activeTab);
      }
    });
  }
  
  viewAll(type: string): void {
    this.router.navigate(['/admin/all-top-employees', type]);
  }
}
