import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { TimeFormatter } from '../../../../utils/genericFunction';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-employee-log-records',
  templateUrl: './employee-log-records.component.html',
  styleUrls: ['./employee-log-records.component.css'],
})
export class EmployeeLogRecordsComponent implements OnInit {
  @Input() employeeLogData: any[] = [];

  allLogRecords: any[] = [];
  allSuggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchTerms: string[] = [];
  searchInput: string = '';
  selectedDate: string = '';
  selectedTab: string = '';

  isDataLoaded: boolean = false;

  inCount: number = 0;
  outCount: number = 0;
  totalCount: number = 0;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'attendanceTime', label: 'Attendance Time' },
    { key: 'checkType', label: 'Check Type' },
  ];
  tabNames = ['In Out', 'In', 'Out'];
  tabs = ['', 'IN', 'OUT'];

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedDate = this.getDefaultDate();
    this.selectedTab = this.tabs[0] || '';
    this.subscribeToItemUpdates();
    this.fetchAttendanceLogs();
  }

  onDateChange() {
    this.isDataLoaded = false;
    this.fetchAttendanceLogs();
  }

  getDefaultDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
      if (update) {
        if (this.selectedTab === '') {
          this.isDataLoaded = false;
          this.getAllAttendanceLogs();
        } else if (this.selectedTab === 'IN' || this.selectedTab === 'OUT') {
          this.isDataLoaded = false;
          this.getAllAttendanceLogsInOut(this.selectedTab);
        }
      }
    });
  }

  onTabChanged(selectedTab: string): void {
    this.isDataLoaded = false;
    this.selectedTab = selectedTab;
    this.fetchAttendanceLogs();
  }

  onFilteredDataChange(filteredData: any[]): void {
    this.employeeLogData = filteredData;
  }

  fetchAttendanceLogs() {
    if (this.selectedTab === '') {
      this.getAllAttendanceLogs();
    } else if (this.selectedTab === 'IN' || this.selectedTab === 'OUT') {
      this.getAllAttendanceLogsInOut(this.selectedTab);
    }
  }

  getAllAttendanceLogs() {
    this.attendanceLogService
      .getAllAttendanceLogs(this.selectedDate)
      .subscribe((data) => {
        this.processAttendanceLogs(data);
        this.isDataLoaded = true;
        this.inCount = 0;
        this.outCount = 0;
      });
  }

  getAllAttendanceLogsInOut(currentType: string) {
    this.attendanceLogService
      .getAllAttendanceLogsInOut(this.selectedDate, currentType)
      .subscribe((data) => {
        this.processAttendanceLogs(data);
        this.isDataLoaded = true;
        this.inCount = data.filter((log) => log.checkType === 'IN').length;
        this.outCount = data.filter((log) => log.checkType === 'OUT').length;
        this.totalCount = this.inCount + this.outCount;
      });
  }

  processAttendanceLogs(data: AttendanceLogModel[]) {
    this.allLogRecords = data.map((log) => {
      const dateTime = new Date(log.attendanceLogTime);
      return {
        ...log,
        attendanceDate: dateTime.toLocaleDateString(),
        attendanceTime: TimeFormatter.formatTime(dateTime),
      };
    });

    const uniqueNames = new Set(this.allLogRecords.map((log) => log.fullName));
    this.allSuggestions = Array.from(uniqueNames);

    this.performSearch();
  }

  onInputChange() {
    this.filteredSuggestions = this.allSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }

  addTerm() {
    const trimmedInput = this.searchInput.trim();
    if (
      trimmedInput &&
      this.allSuggestions.includes(trimmedInput) &&
      !this.searchTerms.includes(trimmedInput)
    ) {
      this.searchTerms.push(trimmedInput);
      this.searchInput = '';
      this.filteredSuggestions = [];
      this.performSearch();
    }
  }

  removeTerm(term: string) {
    this.searchTerms = this.searchTerms.filter((t) => t !== term);
    this.performSearch();
  }

  selectSuggestion(suggestion: string) {
    this.searchInput = suggestion;
    this.addTerm();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.filteredSuggestions.length > 0) {
      this.selectSuggestion(this.filteredSuggestions[0]);
      event.preventDefault();
    }
  }

  performSearch() {
    if (this.searchTerms.length === 0) {
      this.employeeLogData = this.allLogRecords;
    } else {
      const query = this.searchTerms.join(' ').toLowerCase();
      this.employeeLogData = this.allLogRecords.filter((log) =>
        this.searchTerms.some((term) =>
          log.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    this.isDataLoaded = true;
  }

  exportToCSV() {
    const dataToExport = this.allLogRecords.map(({ fullName, attendanceTime, checkType }) => ({
      'Employee Name': fullName,
      'Attendance Time': attendanceTime,
      'Check Type': checkType
    }));
  
    const filenameMap: { [key: string]: string } = {
      '': 'employee-log-records-in-out',
      'IN': 'employee-log-records-in',
      'OUT': 'employee-log-records-out'
    };
    
    const filename = filenameMap[this.selectedTab as keyof typeof filenameMap] || 'employee-log-records';
  
    const options = {
      filename: filename,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: ['Employee Name','Attendance Time', 'Check Type'],
      noDownload: false,
      removeEmptyValues: true,
    };
  
    new ngxCsv(dataToExport, options.filename, options);
  }
  
}
