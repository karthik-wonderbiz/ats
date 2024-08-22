import { Component, OnInit } from '@angular/core';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { UpdateEmployeeDetailsComponent } from '../update-employee-details/update-employee-details.component';

@Component({
  selector: 'app-employee-status',
  templateUrl: './employee-status.component.html',
  styleUrls: ['./employee-status.component.css']
})
export class EmployeeStatusComponent implements OnInit {
  totalEmployees: number = 0;
  presentEmployees: number = 0;
  workFromHomeEmployees: number = 0;
  absentEmployees: number = 0;

  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  filter: 'all' | 'present' | 'absent' | 'wfh' = 'all';

  constructor(private attendanceLogService: AttendanceLogService, private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.subscribeToItemUpdates();
    // this.fetchAttendanceData();
    this.subscribeToUserUpdates();
    this.getSummaryData();
  }

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
    inTime: ''
  };
  

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      console.log('Item update received:', update);
      if (update) {
        this.getSummaryData();
      }
    });
  }

  private subscribeToUserUpdates(): void {
    this.signalRService.userUpdate$.subscribe(update =>{
      console.log('User update received:', update);
      if (update) {
        this.getSummaryData();
      }
    })
  }

  // private fetchAttendanceData(): void {
  //   this.attendanceLogService.getTodayAttendanceLogStatus(this.).subscribe((data) => {
  //     this.totalEmployees = data.length;
  //     this.presentEmployees = data.filter(log => log.status === 'Present').length;
  //     this.absentEmployees = data.filter(log => log.status === 'Absent').length;
  //     this.workFromHomeEmployees = data.filter(log => log.status === 'Work From Home').length;

  //     this.allEmployees = data.map(employee => {
  //       return {
  //         userId: employee.userId,
  //         inOutTime: employee.inOutTime,
  //         checkType: employee.checkType,
  //         total: employee.total,
  //         present: employee.present,
  //         wfh: employee.wfh,
  //         absent: employee.absent,
  //         startDate: employee.startDate,
  //         endDate: employee.endDate,
  //         attendanceLogTime: employee.attendanceLogTime,
  //         firstName: employee.firstName,
  //         lastName: employee.lastName,
  //         totalHours: employee.totalHours,
  //         profilePic: employee.profilePic,
  //         fullName: employee.fullName,
  //         lastCheckInTime: employee.lastCheckInTime,
  //         lastCheckOutTime: employee.lastCheckOutTime,
  //         status: employee.status === 'Present' ? 'Present' : 'Absent',
  //         inTime: employee.status === 'Present' ? employee.inTime : null
  //       };
  //     });
  //     // this.filterEmployees();
  //   });
  // }

  getSummaryData(): void {
    const startDate = this.attendanceLogModel.startDate || '';  // Use empty string if not set
    const endDate = this.attendanceLogModel.endDate || '';      // Use empty string if not set
  
    this.attendanceLogService.getSummaryAttendance(startDate, endDate).subscribe((data) => {
      this.attendanceLogModel = data;
      console.log('Summary data updated:', this.attendanceLogModel);
    });
  }  

  // setFilter(filter: 'all' | 'present' | 'absent' | 'wfh'): void {
  //   this.filter = filter;
  //   this.filterEmployees();
  // }

  // private filterEmployees(): void {
  //   switch (this.filter) {
  //     case 'present':
  //       this.filteredEmployees = this.allEmployees.filter(employee => employee.status === 'Present');
  //       break;
  //     case 'absent':
  //       this.filteredEmployees = this.allEmployees.filter(employee => employee.status === 'Absent');
  //       break;
  //     case 'wfh':
  //       this.filteredEmployees = this.allEmployees.filter(employee => employee.status === 'Wfh');
  //       break;
  //     default:
  //       this.filteredEmployees = [...this.allEmployees];
  //       break;
  //   }
  // }
}
