import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { ngxCsv } from 'ngx-csv';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-top-employees',
  templateUrl: './all-top-employees.component.html',
  styleUrls: ['./all-top-employees.component.css'],
})
export class AllTopEmployeesComponent implements OnInit {
  type: string | null = null;

  allEmployeeMaxInData: any[] = [];
  allEmployeeMaxOutData: any[] = [];
  allEmployeeMinInData: any[] = [];
  allEmployeeMinOutData: any[] = [];

  isTabChanged: boolean = false;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' },
  ];
  tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All-Time'];
  tabNames = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];
  activeTab: string = 'Daily';

  constructor(
    private route: ActivatedRoute,
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.type = params.get('type');
      switch (this.type?.toLowerCase()) {
        case 'max in hours':
          this.loadMaxInData(this.activeTab);
          this.subscribeToItemUpdates();
          break;
        case 'max out hours':
          this.loadMaxOutData(this.activeTab);
          this.subscribeToItemUpdates();
          break;
        case 'min in hours':
          this.loadMinInData(this.activeTab);
          this.subscribeToItemUpdates();
          break;
        case 'min out hours':
          this.loadMinOutData(this.activeTab);
          this.subscribeToItemUpdates();
          break;
      }
    });
  }

  loadMaxInData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesInHours(reportType)
      .subscribe((data) => {
        this.allEmployeeMaxInData = data;
        this.isTabChanged = false;
        console.log(
          `Employee Max In Data for ${reportType}:`,
          this.allEmployeeMaxInData
        );
      });
  }

  loadMinInData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesInHours(reportType)
      .subscribe((data) => {
        this.allEmployeeMinInData = data.reverse();
        this.isTabChanged = false;
        console.log(
          `Employee Max In Data for ${reportType}:`,
          this.allEmployeeMaxInData
        );
      });
  }

  loadMaxOutData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesOutHours(reportType)
      .subscribe((data) => {
        this.allEmployeeMaxOutData = data;
        this.isTabChanged = false;
        console.log(
          `Employee Max Out Data for ${reportType}:`,
          this.allEmployeeMaxOutData
        );
      });
  }

  loadMinOutData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService
      .getAllEmployeesOutHours(reportType)
      .subscribe((data) => {
        this.allEmployeeMinOutData = data.reverse();
        this.isTabChanged = false;
        console.log(
          `Employee Max Out Data for ${reportType}:`,
          this.allEmployeeMaxOutData
        );
      });
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
      if (update) {
        this.route.paramMap.subscribe((params) => {
          this.type = params.get('type');
          switch (this.type?.toLowerCase()) {
            case 'max in hours':
              this.loadMaxInData(this.activeTab);
              this.subscribeToItemUpdates();
              break;
            case 'max out hours':
              this.loadMaxOutData(this.activeTab);
              this.subscribeToItemUpdates();
              break;
            case 'min in hours':
              this.loadMinInData(this.activeTab);
              this.subscribeToItemUpdates();
              break;
            case 'min out hours':
              this.loadMinOutData(this.activeTab);
              this.subscribeToItemUpdates();
              break;
          }
        });
      }
    });
  }

  onTabChanged(reportType: string): void {
    this.activeTab = reportType;
    this.isTabChanged = true;
    switch (this.type?.toLowerCase()) {
      case 'max in hours':
        this.loadMaxInData(this.activeTab);
        this.subscribeToItemUpdates();
        break;
      case 'max out hours':
        this.loadMaxOutData(this.activeTab);
        this.subscribeToItemUpdates();
        break;
      case 'min in hours':
        this.loadMinInData(this.activeTab);
        this.subscribeToItemUpdates();
        break;
      case 'min out hours':
        this.loadMinOutData(this.activeTab);
        this.subscribeToItemUpdates();
        break;
    }
  }

  exportToCSV(data: any[], filenamePrefix: string): void {
    const filenameMap = {
      Daily: `${filenamePrefix}-daily`,
      Weekly: `${filenamePrefix}-weekly`,
      Monthly: `${filenamePrefix}-monthly`,
      Yearly: `${filenamePrefix}-yearly`,
      'All-Time': `${filenamePrefix}-all-time`,
    };

    const filename =
      filenameMap[this.activeTab as keyof typeof filenameMap] || filenamePrefix;

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

    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `Data has been successfully exported as ${filename}.csv`,
      timer: 3000,
    });
  }
}
