import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { UserService } from '../../../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit {
  @Output() rowClicked = new EventEmitter<any>();
  employees: any[] = [];
  allEmployees: any[] = [];
  allSuggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchTerms: string[] = [];
  searchInput: string = '';

  columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'contactNo', label: 'Phone Number' },
    { key: 'action', label: 'Action' },
  ];

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private signalRService: SignalRService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscribeToItemUpdates();
    this.getAllEmployeeHours();
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
      console.log('Item update received:', update);
      if (update) {
        this.getAllEmployeeHours();
      }
    });
  }

  getAllEmployeeHours() {
    const reportType = '';
    this.employeeService.getAllEmployeeInfo().subscribe((data) => {
      this.allEmployees = data;
      this.allSuggestions = this.allEmployees.map(
        (employee) => employee.fullName
      );
      this.performSearch();
      console.log('Employee Data:', this.allEmployees);
    });
  }

  onRowClicked(employee: any) {
    if (employee && employee.id) {
      console.log(employee.id);
      const encryptedId = EncryptDescrypt.encrypt(employee.id.toString());
      this.router.navigate(['/admin/employee-detail', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  onEditClicked(employee: any) {
    if (employee && employee.id) {
      console.log(employee.id);
      const encryptedId = EncryptDescrypt.encrypt(employee.id.toString());
      this.router.navigate(['/admin/update-employee-details', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  onDeleteClicked(employee: any) {
    if (employee && employee.id) {
      console.log(employee.id);
      this.userService.deleteUserById(employee.userId).subscribe((data) => {
        alert('Employee deleted Successfully.');
        window.location.reload();
      });
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
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
      this.searchInput = ''; // Clear the input box
      this.filteredSuggestions = []; // Clear suggestions
      this.performSearch(); // Filter employees based on the updated search terms
    }
  }

  removeTerm(term: string) {
    this.searchTerms = this.searchTerms.filter((t) => t !== term);
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
      this.employees = this.allEmployees.filter((employee) =>
        this.searchTerms.some((term) =>
          employee.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    console.log('Filtered employees:', this.employees);
  }
}
