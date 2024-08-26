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
  @ViewChild('hoursTable') hoursTable: TableWithTabsComponent | undefined;

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
  activeTab: string = 'Daily';

  isTabChanged: boolean = false;

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const startDate = '';
    const endDate = '';
    this.loadEmployeeInData(this.activeTab);
    this.loadEmployeeOutData(startDate, endDate, this.activeTab);
    this.subscribeToItemUpdates();
  }

  
  loadEmployeeInData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours(reportType).subscribe((data) => {
      this.top5EmployeeIn = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data in for ${reportType}:`, this.top5EmployeeIn);
    });
  }

  loadEmployeeOutData(startDate: string, endDate: string, reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours().subscribe((data) => {
      this.top5EmployeeOut = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee out Data for ${reportType}:`, this.top5EmployeeOut);
    });
  }

  onTabChanged(reportType: string): void {
    const startDate = ''; 
    const endDate = '';
    this.activeTab = reportType;
    this.isTabChanged = true;
    this.loadEmployeeInData(reportType);
    this.loadEmployeeOutData(startDate, endDate, reportType);
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        const activeTab = this.hoursTable?.activeTab || 'Daily';
        this.loadEmployeeInData(activeTab);
        this.loadEmployeeOutData('', '', activeTab);
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
  
    const filename = filenameMap[this.activeTab as keyof typeof filenameMap] || filenamePrefix;
  
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
