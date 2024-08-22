import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';

@Component({
  selector: 'app-all-top-employees',
  templateUrl: './all-top-employees.component.html',
  styleUrls: ['./all-top-employees.component.css']
})
export class AllTopEmployeesComponent implements OnInit {
  type: string | null = null;
  allEmployeeData: any[] = [];
  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalHours', label: 'Total Hours' }
  ];
  tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All-Time'];
  tabNames = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'All Time'];
  activeTab: string = 'Daily';

  constructor(
    private route: ActivatedRoute,
    private attendanceLogService: AttendanceLogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
      if(this.type=='max in Hours'){
        this.loadInData(this.activeTab);
      } else{
        this.loadOutData(this.activeTab);
      }
    });
  }

  loadInData(reportType: string): void {
    this.attendanceLogService.getAllEmployeesInHours().subscribe(data => {
      this.allEmployeeData = data;
      console.log(`Employee Max In Data for ${reportType}:`, this.allEmployeeData);
    });
  }
  loadOutData(reportType: string): void {
    this.attendanceLogService.getAllEmployeesOutHours().subscribe(data => {
      this.allEmployeeData = data;
      console.log(`Employee Max out Data for ${reportType}:`, this.allEmployeeData);
    });
  }


  onTabChanged(reportType: string): void {
    this.activeTab = reportType;
    if(this.type=='max in hours'){
      this.loadInData(reportType);
    } else{
      this.loadOutData(reportType);
    }

  }
}
