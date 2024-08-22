import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service'; // Import SignalR service
import { ngxCsv } from 'ngx-csv';
import {
  EncryptDescrypt,
  TimeFormatter,
} from '../../../../utils/genericFunction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-log-records',
  templateUrl: './employee-log-records.component.html',
  styleUrls: ['./employee-log-records.component.css'], // Fix styleUrls property name
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
    this.selectedTab = this.tabs[0] || ''; // Set default tab
    this.subscribeToItemUpdates();
    this.fetchAttendanceLogs();
  }

  onDateChange() {
    console.log('Selected date:', this.selectedDate);
    this.isDataLoaded = false;
    this.fetchAttendanceLogs(); // Updated
  }

  getDefaultDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
      console.log('Item update received:', update);
      if (update) {
        this.getAllAttendanceLogs();
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

  exportToCSV() {
    const options = {
      filename: 'employee-log-records-details',
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

    new ngxCsv(this.employeeLogData, options.filename, options);
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
    inTime: '',
  };

  fetchAttendanceLogs() {
    this.isDataLoaded = false;
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
      });
  }

  getAllAttendanceLogsInOut(currentType: string) {
    this.attendanceLogService
      .getAllAttendanceLogsInOut(this.selectedDate, currentType)
      .subscribe((data) => {
        this.processAttendanceLogs(data);
        this.isDataLoaded = true;
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
    console.log('Sorted and Transformed Data:', this.employeeLogData);
  }

  // Search related methods
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
      this.searchInput = ''; // Clear the input box
      this.filteredSuggestions = []; // Clear suggestions
      this.performSearch(); // Filter logs based on the updated search terms
    }
  }

  removeTerm(term: string) {
    this.searchTerms = this.searchTerms.filter((t) => t !== term);
    this.performSearch(); // Filter logs based on the updated search terms
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
      this.employeeLogData = this.allLogRecords; // Show all logs if no search terms
    } else {
      const query = this.searchTerms.join(' ').toLowerCase();
      this.employeeLogData = this.allLogRecords.filter((log) =>
        this.searchTerms.some((term) =>
          log.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    console.log('Filtered logs:', this.employeeLogData);
    this.isDataLoaded = true;
  }
}
