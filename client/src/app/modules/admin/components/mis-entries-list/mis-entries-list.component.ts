import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { ngxCsv } from 'ngx-csv';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-entries-list',
  templateUrl: './mis-entries-list.component.html',
  styleUrls: ['./mis-entries-list.component.css']
})
export class MisEntriesListComponent implements OnInit {
  @Input() misEntriesData: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();

  searchTerm: string = '';
  filteredNames: { fullName: string; userId: string; profilePic: string }[] = [];
  names: { fullName: string; userId: string; profilePic: string }[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedUserId: string = '';

  isDataLoaded: boolean = true;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'totalCount', label: 'Misentry Count' }
  ];

  constructor(
    private attendancelogservice: AttendanceLogService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllMisEntriesList();
  }

  onRowClicked(employee: any) {
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/admin/mis-entries', encryptedId, this.selectedDate]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  onSearch(): void {
    this.filteredNames = this.names.filter(name =>
      name.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectName(selectedName: string, index: number): void {
    const matchingEmployees = this.names.filter(employee => employee.fullName === selectedName);
    if (matchingEmployees.length > index) {
      const selectedEmployee = matchingEmployees[index];
      this.searchTerm = selectedEmployee.fullName;
      this.selectedUserId = selectedEmployee.userId;
      this.fetchAllMisEntriesList();
    }
  
    this.filteredNames = [];
  }

  fetchAllMisEntriesList(): void{
    if(this.selectedUserId || this.selectedDate){
      this.isDataLoaded = false;
      this.attendancelogservice.getMisEntriesList(this.selectedDate, this.selectedUserId)
      .subscribe((data) => {
        this.misEntriesData = data;
        this.isDataLoaded = true;
        this.names = this.misEntriesData.map((employee) => ({
          fullName: employee.fullName,
          userId: employee.userId,
          profilePic: employee.profilePic,
        }));
        console.log(this.misEntriesData);
      });
    }
  }

  onDateChange(): void {
    this.fetchAllMisEntriesList();
  }

  exportToCSV() {
    const dataToExport = this.misEntriesData.map(({ id, fullName, count}) => ({
      'Employee Id': id,
      'Name': fullName,
      'Count': count
    }));

    const filename = 'List-of-MisEntries-of-Employees';

    const options = {
      filename: filename,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      headers: ['Employee Id', 'Name', 'Count'],
      noDownload: false,
      removeEmptyValues: true,
    };

    new ngxCsv(dataToExport, options.filename, options);

    // Swal.fire({
    //   icon: 'success',
    //   title: 'Export Successful',
    //   text: `Data has been successfully exported as ${filename}.csv`,
    //   timer: 3000
    // });
  }
}
