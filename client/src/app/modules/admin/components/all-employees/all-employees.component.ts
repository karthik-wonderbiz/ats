import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { SignalRService } from '../../../../services/signalR/signal-r.service';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { UserService } from '../../../../services/user/user.service';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';


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

  isDataLoaded: boolean = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const searchBox = document.querySelector('.search-box');

    if (searchBox && !searchBox.contains(targetElement)) {
      this.filteredSuggestions = [];
    }
  }

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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscribeToItemUpdates();
    this.subscribeToUserUpdates();
    this.getAllEmployees();
  }

  private subscribeToItemUpdates(): void {
    this.signalRService.itemUpdate$.subscribe((update) => {
      console.log('Item update received:', update);
      if (update) {
        this.getAllEmployees();
        this.isDataLoaded = false;
      }
    });
  }

  private subscribeToUserUpdates(): void {
    this.signalRService.userUpdate$.subscribe(update =>{
      console.log('User update received:', update);
      if (update) {
        this.getAllEmployees();
        this.isDataLoaded = false;
      }
    })
  }

  getAllEmployees() {
    const reportType = '';
    this.employeeService.getAllEmployeeInfo().subscribe((data) => {
      this.isDataLoaded = true;
      this.allEmployees = data;
      console.log(data)
      this.allSuggestions = this.allEmployees.map(
        (employee) => employee.fullName
      );
      this.performSearch();
      console.log('Employee Data:', this.allEmployees);
    });
  }

  onRowClicked(employee: any) {
    console.log('clicked')
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/admin/employee-detail', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  onEditClicked(employee: any) {
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/admin/update-employee-details', encryptedId]);
      
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  onDeleteClicked(employee: any) {
    if (employee && employee.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete ${employee.fullName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.deleteUserById(employee.userId).subscribe(
            (data) => {
              Swal.fire({
                title: 'Deleted!',
                text: `${employee.fullName} has been deleted.`,
                showConfirmButton: false,
                icon: 'success'
              });
              this.getAllEmployees();
            },
            (error) => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the employee.',
                'error'
              );
            }
          );
        }
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
      this.employees = this.allEmployees;
    } else {
      const query = this.searchTerms.join(' ').toLowerCase();
      this.employees = this.allEmployees.filter((employee) =>
        this.searchTerms.some((term) =>
          employee.fullName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    this.isDataLoaded = true;
    console.log('Filtered employees:', this.employees);
  }

  exportToCSV() {
    const dataToExport = this.employees.map(({ id, fullName, email, contactNo}) => ({
      'Employee Id': id,
      'Name': fullName,
      'Email': email,
      'Phone Number': contactNo
    }));

    const filename = 'employee-details';

    const options = {
      filename: filename,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: ['Employee Id', 'Name', 'Email', 'Phone Number'],
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
