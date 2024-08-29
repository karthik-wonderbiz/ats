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
  styleUrls: ['./top-employees.component.css'],
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

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' },
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

  loadEmployeeMaxInData(reportTypeMaxIn: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesInHours(reportTypeMaxIn)
      .subscribe((data) => {
        this.top5EmployeeMaxIn = data.slice(0, 5);
        this.isTabChanged = false;
        console.log(
          `Top 5 Employee Data max in for ${reportTypeMaxIn}:`,
          this.top5EmployeeMaxIn
        );
      });
  }
  onTabChangedMaxIn(reportTypeMaxIn: string): void {
    this.activeTabMaxIn = reportTypeMaxIn;
    this.isTabChanged = true;
    this.loadEmployeeMaxInData(reportTypeMaxIn);
  }

  loadEmployeeMinInData(reportTypeMinIn: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesInHours(reportTypeMinIn)
      .subscribe((data) => {
        this.top5EmployeeMinIn = data.reverse().slice(0, 5);
        this.isTabChanged = false;
        console.log(
          `Top 5 Employee Data min in for ${reportTypeMinIn}:`,
          this.top5EmployeeMinIn
        );
      });
  }
  onTabChangedMinIn(reportTypeMinIn: string): void {
    this.activeTabMaxIn = reportTypeMinIn;
    this.isTabChanged = true;
    this.loadEmployeeMinInData(reportTypeMinIn);
  }

  loadEmployeeMaxOutData(reportTypeMaxOut: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesOutHours(reportTypeMaxOut)
      .subscribe((data) => {
        this.top5EmployeeMaxOut = data.slice(0, 5);
        this.isTabChanged = false;
        console.log(
          `Top 5 Employee Data max out for ${reportTypeMaxOut}:`,
          this.top5EmployeeMaxOut
        );
      });
  }
  onTabChangedMaxOut(reportTypeMaxOut: string): void {
    this.activeTabMaxOut = reportTypeMaxOut;
    this.isTabChanged = true;
    this.loadEmployeeMaxOutData(reportTypeMaxOut);
  }

  loadEmployeeMinOutData(reportTypeMinOut: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesOutHours(reportTypeMinOut)
      .subscribe((data) => {
        this.top5EmployeeMinOut = data.reverse().slice(0, 5);
        this.isTabChanged = false;
        console.log(
          `Top 5 Employee Data min out for ${reportTypeMinOut}:`,
          this.top5EmployeeMinOut
        );
      });
  }
  onTabChangedMinOut(reportTypeMinOut: string): void {
    this.activeTabMaxOut = reportTypeMinOut;
    this.isTabChanged = true;
    this.loadEmployeeMinOutData(reportTypeMinOut);
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
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
    this.router.navigate(['/ats/all-top-employees', type]);
  }

  exportToCSV(data: any[], filenamePrefix: string): void {
    const filenameMap = {
      Daily: `${filenamePrefix}-daily`,
      Weekly: `${filenamePrefix}-weekly`,
      Monthly: `${filenamePrefix}-monthly`,
      Yearly: `${filenamePrefix}-yearly`,
      'All-Time': `${filenamePrefix}-all-time`,
    };

    let filename = filenamePrefix;

    switch (filenamePrefix) {
      case 'Top 5 Employees with Max In Hours':
        filename =
          filenameMap[this.activeTabMaxIn as keyof typeof filenameMap] ||
          filenamePrefix;
        break;
      case 'Top 5 Employees with Max Out Hours':
        filename =
          filenameMap[this.activeTabMaxOut as keyof typeof filenameMap] ||
          filenamePrefix;
        break;
      case 'Top 5 Employees with Min In Hours':
        filename =
          filenameMap[this.activeTabMinIn as keyof typeof filenameMap] ||
          filenamePrefix;
        break;
      case 'Top 5 Employees with Min Out Hours':
        filename =
          filenameMap[this.activeTabMinOut as keyof typeof filenameMap] ||
          filenamePrefix;
        break;
      default:
        filename = filenamePrefix;
        break;
    }

    const dataToExport = data.map(({ fullName, totalHours }) => ({
      'Employee Name': fullName,
      'Total Hours': totalHours,
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
      removeEmptyValues: true,
    });

    // Swal.fire({
    //     icon: 'success',
    //     title: 'Export Successful',
    //     text: `Data has been successfully exported as ${filename}.csv`,
    //     timer: 3000
    // });
  }
}
