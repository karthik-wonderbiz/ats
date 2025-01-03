import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { TimeFormatter } from '../../../../utils/genericFunction';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-log-records',
  templateUrl: './employee-log-records.component.html',
  styleUrls: ['./employee-log-records.component.css'],
})
export class EmployeeLogRecordsComponent implements OnInit {
  @Input() employeeLogData: any[] = [];

  allLogRecords: any[] = [];
  allSuggestions: { fullName: string; profilePic: string }[] = [];
  filteredSuggestions: { fullName: string; profilePic: string }[] = [];
  searchTerms: string[] = [];
  searchInput: string = '';
  selectedDate: string = '';
  selectedTab: string = '';
  roleId: number = 2;
  userId: number = 0;

  isDataLoaded: boolean = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const searchBox = document.querySelector('.search-box');

    if (searchBox && !searchBox.contains(targetElement)) {
      this.filteredSuggestions = [];
    }
  }

  inCount: number = 0;
  outCount: number = 0;
  totalCount: number = 0;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'attendanceTime', label: 'Attendance Time' },
    { key: 'checkType', label: 'Check Type' }
  ];
  tabNames = ['In Out', 'In', 'Out'];
  tabs = ['', 'IN', 'OUT'];

  constructor(
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedDate = this.getDefaultDate();
    this.selectedTab = this.tabs[0] || '';
    this.subscribeToItemUpdates();
    let user = localStorage.getItem("user")
    if (user) {
      this.roleId = JSON.parse(user).roleId
      if (this.roleId == 3) {
        this.userId = JSON.parse(user).userId
      }
      if (this.roleId == 2) {
        this.tabNames = ['In Out', 'In', 'Out'];
        this.tabs = ['', 'IN', 'OUT'];
      } else {
        this.tabNames = ['In Out'];
        this.tabs = [''];
      }
    }
    this.fetchAttendanceLogs();
  }

  onDateChange() {
    this.isDataLoaded = false;
    
    console.log("date changed",this.selectedDate)
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
    console.log("Fetching records")
    if (this.selectedTab === '') {
      console.log("All records")

      this.getAllAttendanceLogs();
    } else if (this.selectedTab === 'IN' || this.selectedTab === 'OUT') {
      console.log("tab records")

      this.getAllAttendanceLogsInOut(this.selectedTab);
    }
  }

  getAllAttendanceLogs() {

    this.attendanceLogService
      .getAllAttendanceLogs(this.selectedDate, this.userId)
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
    // Process attendance logs to include formatted time and date
    this.allLogRecords = data.map((log) => {
      const dateTime = new Date(log.attendanceLogTime);
      return {
        ...log,
        attendanceDate: dateTime.toLocaleDateString(),
        attendanceTime: TimeFormatter.formatTime(dateTime),
      };
    });

    // Create a Map to store unique fullNames and their associated profilePic
    const uniqueLogs = new Map<string, { fullName: string; profilePic: string }>();

    this.allLogRecords.forEach((log) => {
      if (!uniqueLogs.has(log.fullName)) {
        uniqueLogs.set(log.fullName, { fullName: log.fullName, profilePic: log.profilePic });
      }
    });

    // Convert the Map values to an array
    this.allSuggestions = Array.from(uniqueLogs.values());

    this.performSearch();
  }


  onInputChange() {
    this.filteredSuggestions = this.allSuggestions.filter((suggestion) =>
      suggestion.fullName.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }

  addTerm() {
    const trimmedInput = this.searchInput.trim();
    const selectedSuggestion = this.allSuggestions.find(
      (suggestion) => suggestion.fullName === trimmedInput
    );

    if (
      trimmedInput &&
      selectedSuggestion &&
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

  selectSuggestion(suggestion: { fullName: string; profilePic: string }) {
    this.searchInput = suggestion.fullName;
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
    const dataToExport = this.allLogRecords.map(({ fullName, attendanceTime, checkType, profilePic }) => ({
      'Employee Name': fullName,
      'Attendance Time': attendanceTime,
      'Check Type': checkType,
      'Profile Picture': profilePic // Include profilePic in the export
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
      headers: ['Employee Name', 'Attendance Time', 'Check Type', 'Profile Picture'],
      noDownload: false,
      removeEmptyValues: true,
    };

    new ngxCsv(dataToExport, options.filename, options);

    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `Data has been successfully exported as ${filename}.csv`,
      timer: 3000
    });
  }
}
