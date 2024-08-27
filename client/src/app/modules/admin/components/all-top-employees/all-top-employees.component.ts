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
  allEmployeeInData: any[] = [];
  allEmployeeOutData: any[] = [];
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
      if (this.type?.toLowerCase() === 'max in hours') {
        this.loadInData(this.activeTab);
        this.subscribeToItemUpdates();
      } else {
        this.loadOutData(this.activeTab);
        this.subscribeToItemUpdates();
      }
    });
  }

  loadInData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesInHours(reportType).subscribe((data) => {
      this.allEmployeeInData = data;
      this.isTabChanged = false;
      console.log(
        `Employee Max In Data for ${reportType}:`,
        this.allEmployeeInData
      );
    });
  }

  loadOutData(reportType: string): void {
    this.isTabChanged = true;
    this.attendanceLogService.getAllEmployeesOutHours(reportType).subscribe((data) => {
      this.allEmployeeOutData = data;
      this.isTabChanged = false;
      console.log(
        `Employee Max Out Data for ${reportType}:`,
        this.allEmployeeOutData
      );
    });
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        this.route.paramMap.subscribe((params) => {
          this.type = params.get('type');
          if (this.type?.toLowerCase() === 'max in hours') {
            this.loadInData(this.activeTab);
          } else {
            this.loadOutData(this.activeTab);
          }
        });
      }
    });
  }

  onTabChanged(reportType: string): void {
    this.activeTab = reportType;
    if (this.type?.toLowerCase() === 'max in hours') {
      this.isTabChanged = true;
      this.loadInData(reportType);
    } else {
      this.isTabChanged = true;
      this.loadOutData(reportType);
    }
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
