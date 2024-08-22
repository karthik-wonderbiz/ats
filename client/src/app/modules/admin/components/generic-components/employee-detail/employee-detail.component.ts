import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceLogService } from '../../../../../services/attendanceLog/attendance-log.service';
import { ActivityRecordModel } from '../../../../../model/ActivityRecord.model';
import { EncryptDescrypt } from '../../../../../utils/genericFunction';
import { EmployeeService } from '../../../../../services/employee/employee.service';
import { UserService } from '../../../../../services/user/user.service';
import { SignalRService } from '../../../../../services/signalR/signal-r.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = {};
  user: any = {};
  inOutData: any[] = [];
  selectedDate: Date = new Date();
  formattedDate: string = '';

  columnsTable1 = [
    { key: 'inTime', label: 'In Time' },
    { key: 'outTime', label: 'Out Time' },
    { key: 'inHours', label: 'Total In Time' },
  ];

  columnsTable2 = [
    { key: 'inTime', label: 'In Time' },
    { key: 'outTime', label: 'Out Time' },
    { key: 'outHours', label: 'Total Out Time' },
  ];

  tabNames = ['Today', 'Yesterday', 'Day Before Yesterday'];
  tabs = ['today', 'yesterday', 'dayBeforeYesterday'];

  activeTab: string = 'today';

  constructor(
    private route: ActivatedRoute,
    private attendanceLogService: AttendanceLogService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private signalRService: SignalRService  // Inject SignalR service
  ) {}

  activityInRecords: ActivityRecordModel[] = [];
  activityOutRecords: ActivityRecordModel[] = [];

  startDate: string = '';
  endDate: string = '';

  
  ngOnInit() {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      console.log('Decrypted Employee ID:', employeeId);

      this.updateDatesAndFetchData();

      this.employeeService.getEmployeeByUserId(employeeId).subscribe(data => {
        this.employee = data;
        console.log('Employee Data:', this.employee);
      });

      this.userService.getUserById(employeeId).subscribe(data => {
        this.user = data;
        console.log('User Data:', this.user);
      });

      this.formattedDate = this.selectedDate.toLocaleDateString();

      this.subscribeToItemUpdates(employeeId);  // Subscribe to SignalR updates
    } else {
      console.error('Employee ID is missing in the URL');
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateDatesAndFetchData(); // Update dates and fetch data based on the selected tab
  }

  updateDatesAndFetchData(): void {
    const currentDate = new Date();

    switch (this.activeTab) {
      case 'today':
        this.startDate = this.formatDate(currentDate);
        this.endDate = this.formatDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)); // Next day
        break;
      case 'yesterday':
        this.startDate = this.formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)); // Previous day
        this.endDate = this.formatDate(currentDate);
        break;
      case 'dayBeforeYesterday':
        this.startDate = this.formatDate(new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000)); // Two days ago
        this.endDate = this.formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)); // Previous day
        break;
    }

    this.fetchActivityRecords();
  }

  fetchActivityRecords(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);

      this.attendanceLogService
        .getActivityRecordsInByUserId(employeeId, this.startDate, this.endDate)
        .subscribe((dataIn) => {
          this.activityInRecords = this.formatActivityRecords(dataIn);
          // console.log('Activity In Records:', this.activityInRecords);
        });

      this.attendanceLogService.getActivityRecordsOutByUserId(employeeId, this.startDate, this.endDate)
        .subscribe((dataOut) => {
          this.activityOutRecords = this.formatActivityRecords(dataOut);
          // console.log('Activity Out Records:', this.activityOutRecords);
        });
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
  }

  formatActivityRecords(records: ActivityRecordModel[]): ActivityRecordModel[] {
    return records.map(record => ({
      ...record
    }));
  }

  // Subscribe to SignalR updates
  private subscribeToItemUpdates(employeeId: string): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        // Reload employee, user, and activity records when an update is received
        this.employeeService.getEmployeeByUserId(employeeId).subscribe(data => {
          this.employee = data;
          // console.log('Updated Employee Data:', this.employee);
        });

        this.userService.getUserById(employeeId).subscribe(data => {
          this.user = data;
          // console.log('Updated User Data:', this.user);
        });

        this.fetchActivityRecords();
      }
    });
  }
}
