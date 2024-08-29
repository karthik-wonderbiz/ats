import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { AttendanceLogModel } from '../../../../model/AttendanceLog.model';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employee-status-details',
  templateUrl: './employee-status-details.component.html',
  styleUrls: ['./employee-status-details.component.css'],
})
export class EmployeeStatusDetailsComponent implements OnInit {
  @Input() employeeData: any[] = [];
  @Input() allEmployeeData: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();
  allSuggestions: { fullName: string; profilePic: string }[] = [];
  filteredSuggestions: { fullName: string; profilePic: string }[] = [];
  searchTerms: string[] = [];
  searchInput: string = '';
  isLoaded: boolean = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const searchBox = document.querySelector('.search-box');

    if (searchBox && !searchBox.contains(targetElement)) {
      this.filteredSuggestions = [];
    }
  }

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'status', label: 'Status' },
    { key: 'inTime', label: 'In Time' },
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
  selectedDate: string = '';
  selectedStatus: string = 'all';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private attendanceLogService: AttendanceLogService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.selectedDate = new Date().toISOString().split('T')[0];

    this.subscribeToItemUpdates();

    this.route.paramMap.subscribe((params) => {
      this.showAll = params.get('showAll') === 'true';
      this.getAllEmployeesLogsStatus();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.selectedStatus = params.get('status') || 'all';
      this.getAllEmployeesLogsStatus();
    });
  }

  private subscribeToItemUpdates(): void {
    this.isLoaded = true;
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
        this.attendanceLogModel.absent =
          this.attendanceLogModel.total - this.attendanceLogModel.present;
        this.allEmployeeData = this.filterData(data);
        this.employeeData = [...this.allEmployeeData];
        this.allSuggestions = this.employeeData.map((employee) => ({
          fullName: employee.fullName,
          profilePic: employee.profilePic,
        }));
        this.isLoaded = false;
        console.log(
          "Filtered Employee Today's Entries: ",
          this.allEmployeeData
        );
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

  onInputChange() {
    this.filteredSuggestions = this.allSuggestions.filter((suggestion) =>
      suggestion.fullName
        .toLowerCase()
        .includes(this.searchInput.toLowerCase())
    );
  }

  addTerm() {
    const trimmedInput = this.searchInput.trim();
    const selectedSuggestion = this.allSuggestions.find(
      (suggestion) => suggestion.fullName === trimmedInput
    );
  
    if (trimmedInput && selectedSuggestion && !this.searchTerms.includes(trimmedInput)) {
      // Add the selected term to search terms
      this.searchTerms = [trimmedInput]; // Ensure only one term is added
      this.searchInput = '';
      this.filteredSuggestions = [];
      this.performSearch(); // Perform search with the updated term
    }
  }
  

  removeTerm(term: string) {
    this.searchTerms = this.searchTerms.filter((t) => t !== term);
    this.performSearch();
  }

  selectSuggestion(suggestion: { fullName: string; profilePic: string }) {
    this.searchInput = suggestion.fullName;
    this.addTerm(); // Add the term and update search
  }
  

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.filteredSuggestions.length > 0) {
      this.selectSuggestion(this.filteredSuggestions[0]);
      event.preventDefault();
    }
  }

  performSearch() {
    if (this.searchTerms.length === 0) {
      this.employeeData = [...this.allEmployeeData];
    } else {
      this.employeeData = this.allEmployeeData.filter((employee) =>
        this.searchTerms.some((term) =>
          employee.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    console.log('Filtered employees:', this.employeeData);
  }
  

  exportToCSV() {
    const dataToExport = this.employeeData.map(
      ({ fullName, status, inTime }) => ({
        'Employee Name': fullName,
        Status: status,
        'In Time': inTime,
      })
    );

    const statusMap: { [key: string]: string } = {
      all: 'All',
      present: 'Present',
      absent: 'Absent',
    };

    const statusLabel = statusMap[this.selectedStatus] || 'All';
    const filename = `employee-status-details-${statusLabel}`;

    const options = {
      filename: filename,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: ['Employee Name', 'Status', 'In Time'],
      noDownload: false,
      removeEmptyValues: true,
    };

    new ngxCsv(dataToExport, options.filename, options);

    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `Data has been successfully exported as ${filename}.csv`,
      timer: 3000,
    });
  }

  onRowClicked(employee: any) {
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/ats/employee-detail', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  viewAllRecords() {
    this.router.navigate([
      '/ats/employee-status-details',
      { showAll: 'true' },
    ]);
  }
}
