import { Component, OnInit, ViewChild } from '@angular/core';
import { TableWithTabsComponent } from '../generic-components/table-with-tabs/table-with-tabs.component';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-employees',
  templateUrl: './top-employees.component.html',
  styleUrls: ['./top-employees.component.css']
})
export class TopEmployeesComponent implements OnInit {
  @ViewChild('hoursTable') hoursTableIn: TableWithTabsComponent | undefined;
  @ViewChild('hoursTable') hoursTableOut: TableWithTabsComponent | undefined;

  top5EmployeeIn: any[] = [];
  top5EmployeeOut: any[] = [];
  allEmployeesInData: any[] = [];
  allEmployeesOutData: any[] = [];
  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];

  tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All-Time'];
  tabNames = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];
  activeTabIn: string = 'Daily';
  activeTabOut: string = 'Daily';

  isTabChanged: boolean = false;

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const startDate = '';
    const endDate = '';
    this.loadEmployeeInData(this.activeTabIn);
    this.loadEmployeeOutData(this.activeTabOut);
    this.subscribeToItemUpdates();
  }

  
  loadEmployeeInData(reportTypeIn: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours(reportTypeIn).subscribe((data) => {
      this.top5EmployeeIn = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data in for ${reportTypeIn}:`, this.top5EmployeeIn);
    });
  }

  loadEmployeeOutData(reportTypeOut: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours(reportTypeOut).subscribe((data) => {
      this.top5EmployeeOut = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee out Data for ${reportTypeOut}:`, this.top5EmployeeOut);
    });
  }

  onTabChangedIn(reportTypeIn: string): void {
    this.activeTabIn = reportTypeIn;
    this.isTabChanged = true;
    this.loadEmployeeInData(reportTypeIn);
    // this.loadEmployeeOutData(reportType);
  }

  onTabChangedOut(reportTypeOut: string): void{
    this.activeTabOut = reportTypeOut;
    this.isTabChanged = true;
    this.loadEmployeeOutData(reportTypeOut);
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        const activeTabIn = this.hoursTableIn?.activeTab || 'Daily';
        const activeTabOut = this.hoursTableOut?.activeTab || 'Daily';
        this.loadEmployeeInData(activeTabIn);
        this.loadEmployeeOutData(activeTabOut);
      }
    });
  }
  
  viewAll(type: string): void {
    this.router.navigate(['/admin/all-top-employees', type]);
  }

  exportToCSV(data: any[], filenamePrefix: string): void {
    const filenameMap = {
      'Daily': `${filenamePrefix}-daily`,
      'Weekly': `${filenamePrefix}-weekly`,
      'Monthly': `${filenamePrefix}-monthly`,
      'Yearly': `${filenamePrefix}-yearly`,
      'All-Time': `${filenamePrefix}-all-time`
    };
  
    const filename = filenameMap[this.activeTabIn as keyof typeof filenameMap] || filenamePrefix;
  
    const dataToExport = data.map(({ fullName, totalHours }) => ({
      'Employee Name': fullName,
      'Total Hours': totalHours
    }));
  
    new ngxCsv(dataToExport, filename, {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: ['Employee Name', 'Total Hours'],
      noDownload: false,
      removeEmptyValues: true
    });
  
    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `Data has been successfully exported as ${filename}.csv`,
      timer: 3000
    });
  }
  
}
