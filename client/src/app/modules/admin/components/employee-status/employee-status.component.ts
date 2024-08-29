import { Component, OnInit } from '@angular/core';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { Router } from '@angular/router';

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

  isDataLoaded: boolean = false;

  // Data for the pie chart
  pieChartData: any[] = [];

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToItemUpdates();
    this.subscribeToUserUpdates();
    this.getSummaryData();
  }

  navigateToDetails(status: 'all' | 'present' | 'absent'): void {
    this.router.navigate(['/ats/employee-status-details'], {
      queryParams: { status: status }
    });
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
      if (update) {
        this.isDataLoaded = false;
        this.getSummaryData();
      }
    });
  }

  private subscribeToUserUpdates(): void {
    this.signalRService.userUpdate$.subscribe(update =>{
      if (update) {
        this.isDataLoaded = false;
        this.getSummaryData();
      }
    })
  }

  getSummaryData(): void {
    const startDate = this.attendanceLogModel.startDate || '';
    const endDate = this.attendanceLogModel.endDate || ''; 
  
    this.attendanceLogService.getSummaryAttendance(startDate, endDate).subscribe((data) => {
      this.attendanceLogModel = data;
      this.updatePieChartData();
      this.isDataLoaded = true;
    });
  }

  private updatePieChartData(): void {
    this.pieChartData = [
      { label: 'Present', value: this.attendanceLogModel.present || 0 },
      { label: 'Absent', value: this.attendanceLogModel.absent || 0 }
    ];
  }
}
