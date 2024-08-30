import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { ActivityRecordModel } from '../../../../model/ActivityRecord.model';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { UserService } from '../../../../services/user/user.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { data } from '@tensorflow/tfjs';
import moment from 'moment';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = {};
  // user: any = {};
  inOutData: any[] = [];
  misEntriesData: any[] = [];
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
    private router: Router,
    private attendanceLogService: AttendanceLogService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private signalRService: SignalRService
  ) {

  }

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
        if (data) {
          this.employee.userId = data[0].userId
        }
        console.log('Employee Data:', this.employee);
      });

      // this.userService.getUserById(employeeId).subscribe(data => {
      //   this.user = data;
      //   console.log('User Data:', this.user);
      // });

      this.formattedDate = this.selectedDate.toLocaleDateString();

      this.subscribeToItemUpdates(employeeId);
    } else {
      console.error('Employee ID is missing in the URL');
    }
    this.loadMisEntriesData();
    this.getEmployeeHoursByUserId();
  }

  onEdit() {
    console.log(this.employee.userId)
    const encryptedId = EncryptDescrypt.encrypt(this.employee.userId.toString());
    this.router.navigate(['/ats/update-employee-details', encryptedId]);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateDatesAndFetchData();
  }

  updateDatesAndFetchData(): void {
    const currentDate = new Date();

    switch (this.activeTab) {
      case 'today':
        this.startDate = this.formatDate(currentDate);
        this.endDate = this.formatDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
        break;
      case 'yesterday':
        this.startDate = this.formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
        this.endDate = this.formatDate(currentDate);
        break;
      case 'dayBeforeYesterday':
        this.startDate = this.formatDate(new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000));
        this.endDate = this.formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
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
        });

      this.attendanceLogService.getActivityRecordsOutByUserId(employeeId, this.startDate, this.endDate)
        .subscribe((dataOut) => {
          this.activityOutRecords = this.formatActivityRecords(dataOut);
        });
    }
  }

  loadMisEntriesData(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      const date = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      this.attendanceLogService.getMisEntriesByUserId(employeeId, date).subscribe((data) => {
        this.misEntriesData = data;
        console.log("MisEntries", this.misEntriesData);
      });
    }
  }


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatActivityRecords(records: ActivityRecordModel[]): ActivityRecordModel[] {
    return records.map(record => ({
      ...record
    }));
  }

  private subscribeToItemUpdates(employeeId: string): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      if (update) {
        this.employeeService.getEmployeeByUserId(employeeId).subscribe(data => {
          this.employee = data;
        });

        // this.userService.getUserById(employeeId).subscribe(data => {
        //   this.user = data;
        // });

        this.fetchActivityRecords();
      }
    });
  }
  employeeHoursData: any[] = [];

  getEmployeeHoursByUserId(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      const startDate = '2024-08-01';
      const endDate = '2024-08-31';
      this.attendanceLogService.getEmployeeHoursByUserId(employeeId, startDate, endDate).subscribe((data) => {
        this.employeeHoursData = data;
        console.log("Employee hours daily data for a month", this.employeeHoursData);
      });
    }
  }

  private generateDateLabels(): string[] {
    const currentMonth = moment().format('YYYY-MM');
    const daysInMonth = moment(currentMonth).daysInMonth();

    return Array.from({ length: daysInMonth }, (_, i) =>
      moment(`${currentMonth}-${i + 1}`).format('YYYY-MM-DD')
    );
  }

  lineChartDataJson = JSON.stringify({
    labels: this.generateDateLabels(),
    datasets: [
      {
        label: 'Threshold (9 hours)',
        data: Array(this.generateDateLabels().length).fill(9),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        borderDash: [10, 5]
      },
      {
        label: 'Daily Hours',
        data: [
          7, 8, 9.5, 8.5, 7, 6, 9, 8.2, 7.8, 9.1,
          8.7, 7.6, 9, 8.9, 7.5, 8.4, 9.2, 8.8, 7.4,
          6.5, 9, 8, 7.2, 6.9, 9, 8.3, 7.7, 9.5, 8.6,
          7
        ],
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false
      }
    ]
  });

  lineChartOptionsJson = JSON.stringify({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  });
}
