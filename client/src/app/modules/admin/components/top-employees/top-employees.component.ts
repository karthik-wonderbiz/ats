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
  @ViewChild('hoursTable') hoursTableMaxIn: TableWithTabsComponent | undefined;
  @ViewChild('hoursTable') hoursTableMaxOut: TableWithTabsComponent | undefined;
  @ViewChild('hoursTable') hoursTableMinIn: TableWithTabsComponent | undefined;
  @ViewChild('hoursTable') hoursTableMinOut: TableWithTabsComponent | undefined;

  top5EmployeeMaxIn: any[] = [];
  top5EmployeeMaxOut: any[] = [];
  top5EmployeeMinIn: any[] = [];
  top5EmployeeMinOut: any[] = [];
  
  // allEmployeesInData: any[] = [];
  // allEmployeesOutData: any[] = [];
  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];

  tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All-Time'];
  tabNames = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];

  activeTabMaxIn: string = 'Daily';
  activeTabMaxOut: string = 'Daily';
  activeTabMinIn: string = 'Daily';
  activeTabMinOut: string = 'Daily';

  isTabChanged: boolean = false;

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployeeMaxInData(this.activeTabMaxIn);
    this.loadEmployeeMaxOutData(this.activeTabMaxOut);
    this.loadEmployeeMinInData(this.activeTabMinIn);
    this.loadEmployeeMinOutData(this.activeTabMinOut);
    this.subscribeToItemUpdates();
  }

  
  loadEmployeeMaxInData(reportTypeIn: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours(reportTypeIn).subscribe((data) => {
      this.top5EmployeeMaxIn = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data max in for ${reportTypeIn}:`, this.top5EmployeeMaxIn);
    });
  }
  onTabChangedMaxIn(reportTypeIn: string): void {
    this.activeTabMaxIn = reportTypeIn;
    this.isTabChanged = true;
    this.loadEmployeeMaxInData(reportTypeIn);
  }

  loadEmployeeMinInData(reportTypeIn: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours(reportTypeIn).subscribe((data) => {
      this.top5EmployeeMinIn = data.reverse().slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data min in for ${reportTypeIn}:`, this.top5EmployeeMinIn);
    });
  }
  onTabChangedMinIn(reportTypeIn: string): void {
    this.activeTabMaxIn = reportTypeIn;
    this.isTabChanged = true;
    this.loadEmployeeMinInData(reportTypeIn);
  }

  loadEmployeeMaxOutData(reportTypeOut: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours(reportTypeOut).subscribe((data) => {
      this.top5EmployeeMaxOut = data.slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data max out for ${reportTypeOut}:`, this.top5EmployeeMaxOut);
    });
  }
  onTabChangedMaxOut(reportTypeOut: string): void{
    this.activeTabMaxOut = reportTypeOut;
    this.isTabChanged = true;
    this.loadEmployeeMaxOutData(reportTypeOut);
  }

  loadEmployeeMinOutData(reportTypeOut: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours(reportTypeOut).subscribe((data) => {
      this.top5EmployeeMinOut = data.reverse().slice(0, 5);
      this.isTabChanged = false;
      console.log(`Top 5 Employee Data min out for ${reportTypeOut}:`, this.top5EmployeeMinOut);
    });
  }
  onTabChangedMinOut(reportTypeOut: string): void{
    this.activeTabMaxOut = reportTypeOut;
    this.isTabChanged = true;
    this.loadEmployeeMinOutData(reportTypeOut);
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        const activeTabMaxIn = this.hoursTableMaxIn?.activeTab || 'Daily';
        const activeTabMaxOut = this.hoursTableMaxOut?.activeTab || 'Daily';
        const activeTabMinIn = this.hoursTableMinIn?.activeTab || 'Daily';
        const activeTabMinOut = this.hoursTableMinOut?.activeTab || 'Daily';
        this.loadEmployeeMaxInData(activeTabMaxIn);
        this.loadEmployeeMaxOutData(activeTabMaxOut);
        this.loadEmployeeMinInData(activeTabMinIn);
        this.loadEmployeeMinOutData(activeTabMinOut);
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
  
    const filename = filenameMap[this.activeTabMaxIn as keyof typeof filenameMap] || filenamePrefix;
  
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
