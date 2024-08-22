import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { SignalRService } from '../../../../services/signalR/signal-r.service';

@Component({
  selector: 'app-employee-status-details',
  templateUrl: './employee-status-details.component.html',
  styleUrls: ['./employee-status-details.component.css'],
})
export class EmployeeStatusDetailsComponent implements OnInit {
  @Input() employeeData: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();
  isLoaded: boolean = false;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'status', label: 'Status' },
    { key: 'inTime', label: 'In time' },
  ];

  attendanceLogModel: AttendanceLogModel = {
    userId: 0,
    inOutTime: '',
    checkType: '',
    total: 0,
    present: 0,
    wfh: 0,
    absent: 0,
    startDate: '',
    endDate: '',
    attendanceLogTime: '',
    firstName: '',
    lastName: '',
    totalHours: '',
    profilePic: '',
    fullName: '',
    lastCheckInTime: '',
    lastCheckOutTime: '',
    status: '',
    inTime: '',
  };

  showAll: boolean = false;
  selectedDate: string = ''; // Bind this to the Date input
  selectedStatus: string = 'all'; // Bind this to the select input

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    // Set selectedDate to today's date by default
    this.selectedDate = new Date().toISOString().split('T')[0];

    this.subscribeToItemUpdates();

    // Check route parameter to decide whether to show all records or not
    this.route.paramMap.subscribe((params) => {
      this.showAll = params.get('showAll') === 'true';
      if (this.showAll) {
        this.getAllEmployeesLogsStatus();
      } else {
        this.getAllEmployeesLogsStatus();
      }
    });
  }

  private subscribeToItemUpdates(): void {
    this.isLoaded=true;
    this.signalRService.itemUpdate$.subscribe((update) => {
      console.log('Item update received:', update);
      if (update) {
        this.getAllEmployeesLogsStatus();
        this.isLoaded = false;
      }
    });
  }

  getAllEmployeesLogsStatus() {
    this.isLoaded = true;
    this.attendanceLogService
      .getTodayAttendanceLogStatus(this.selectedDate)
      .subscribe((data) => {
        this.attendanceLogModel.total = data.length;
        this.attendanceLogModel.present = data.filter(
          (log) => log.status === 'Present'
        ).length;
        this.attendanceLogModel.absent = this.attendanceLogModel.total - this.attendanceLogModel.present;
        this.employeeData = this.filterData(data);
        this.isLoaded = false;
        console.log("Filtered Employee Today's Entries: ", this.employeeData);
      });
  }

  onDateChange() {
    this.getAllEmployeesLogsStatus();
  }

  onStatusChange() {
    this.getAllEmployeesLogsStatus();
  }

  filterData(data: any[]): any[] {
    return data.filter((employee) => {
      const matchesStatus =
        this.selectedStatus === 'all' ||
        employee.status.toLowerCase() === this.selectedStatus;
      return matchesStatus;
    });
  }

  exportToCSV() {
    const options = {
      filename: 'employee-status-details',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: this.columns.map((col) => col.label),
      noDownload: false,
      removeEmptyValues: true,
    };

    new ngxCsv(this.employeeData, options.filename, options);
  }

  onRowClicked(employee: any) {
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/admin/employee-detail', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  // Navigate to show all records
  viewAllRecords() {
    this.router.navigate([
      '/admin/employee-status-details',
      { showAll: 'true' },
    ]);
  }
}
