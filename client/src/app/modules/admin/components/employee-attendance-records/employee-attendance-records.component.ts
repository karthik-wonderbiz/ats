import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { SignalRService } from '../../../../services/signalR/signal-r.service';

@Component({
  selector: 'app-employee-attendance-records',
  templateUrl: './employee-attendance-records.component.html',
  styleUrls: ['./employee-attendance-records.component.css'] // Changed styleUrl to styleUrls
})
export class EmployeeAttendanceRecordsComponent implements OnInit {
  @Output() rowClicked = new EventEmitter<any>();
  employees: any[] = [];
  allEmployees: any[] = []; // To store all fetched employees
  allSuggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchTerms: string[] = [];
  searchInput: string = '';

  columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'lastCheckInTime', label: 'In Time' },
    { key: 'lastCheckOutTime', label: 'Out Time' },
    { key: 'totalHours', label: 'Total Hours' }
  ];

  startDate: Date = new Date();
  endDate: Date = new Date();
  formattedStartDate = this.startDate.toLocaleDateString();
  formattedEndDate = this.startDate.toLocaleDateString();

  constructor(private router: Router, private attendanceLogService: AttendanceLogService, private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.subscribeToItemUpdates();
    this.getAllEmployeeHours(); 
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe(update => {
      console.log('Item update received:', update);
      if (update) {
        this.getAllEmployeeHours();
      }
    });
  }

  getAllEmployeeHours() {
    const reportType = 'Daily';
    this.attendanceLogService.getAllEmployeesHours(this.formattedStartDate, this.formattedEndDate, reportType).subscribe(data => {
      this.allEmployees = data; // Store all employee data
      this.allSuggestions = this.allEmployees.map(employee => employee.fullName);
      this.performSearch(); // Perform initial search/filter based on searchTerms
      console.log("Employee Today's working hours Data:", this.allEmployees);
    });
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

  onInputChange() {
    this.filteredSuggestions = this.allSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }

  addTerm() {
    const trimmedInput = this.searchInput.trim();
    if (trimmedInput && this.allSuggestions.includes(trimmedInput) && !this.searchTerms.includes(trimmedInput)) {
      this.searchTerms.push(trimmedInput);
      this.searchInput = ''; // Clear the input box
      this.filteredSuggestions = []; // Clear suggestions
      this.performSearch(); // Filter employees based on the updated search terms
    }
  }

  removeTerm(term: string) {
    this.searchTerms = this.searchTerms.filter(t => t !== term);
    this.performSearch(); // Filter employees based on the updated search terms
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
      this.employees = this.allEmployees; // Show all employees if no search terms
    } else {
      const query = this.searchTerms.join(' ').toLowerCase();
      this.employees = this.allEmployees.filter(employee =>
        this.searchTerms.some(term =>
          employee.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    console.log('Filtered employees:', this.employees);
  }
}
