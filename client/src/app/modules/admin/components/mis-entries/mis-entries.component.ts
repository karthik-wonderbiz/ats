import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttendanceLogService } from '../../../../services/attendanceLog/attendance-log.service';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptDescrypt, TimeFormatter } from '../../../../utils/genericFunction';

@Component({
  selector: 'app-mis-entries',
  templateUrl: './mis-entries.component.html',
  styleUrls: ['./mis-entries.component.css'],
})
export class MisEntriesComponent implements OnInit {
  @Input() misEntriesData: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();

  searchTerm: string = '';
  filteredNames: { fullName: string; userId: string; profilePic: string }[] = [];
  names: { fullName: string; userId: string; profilePic: string }[] = [];
  selectedDate: string = '';
  selectedUserId: string | null = null;

  columns = [
    { key: 'fullName', label: 'Employee Name' },
    { key: 'attendanceLogTime', label: 'Attendance Time' },
    { key: 'checkType', label: 'Check Type' },
  ];

  constructor(
    private attendancelogservice: AttendanceLogService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllNames();
    this.setInitialValues();
  }

  isDataLoaded: boolean = true;

  getAllNames(): void {
    this.employeeService.getAllEmployeeInfo().subscribe((data) => {
      this.names = data.map((employee) => ({
        fullName: employee.fullName,
        userId: employee.userId,
        profilePic: employee.profilePic, 
      }));
      console.log('Employee Names:', this.names);
      
      if (this.selectedUserId) {
        const selectedEmployee = this.names.find(employee => employee.userId === this.selectedUserId);
        if (selectedEmployee) {
          this.searchTerm = selectedEmployee.fullName;
        }
      }
    });
  }

  setInitialValues(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    const selDate = this.route.snapshot.paramMap.get('date');
    if (encryptedId && selDate) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      this.selectedUserId = employeeId;
      this.selectedDate = selDate;
      this.getAllNames();

      if (this.selectedDate) {
        this.fetchMisEntries();
      }
    }
  }

  fetchMisEntries(): void {
    if (this.selectedUserId && this.selectedDate) {
      this.isDataLoaded = false;
      this.attendancelogservice.getMisEntriesByUserId(this.selectedUserId, this.selectedDate)
        .subscribe((data) => {
          console.log(this.selectedUserId, " ", this.selectedDate);
          // Format attendanceLogTime here
          this.misEntriesData = data.map(entry => ({
            ...entry,
            attendanceLogTime: TimeFormatter.formatTime(new Date(entry.attendanceLogTime)),
          }));
          console.log(this.misEntriesData);
          this.isDataLoaded = true;
        });
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
      this.fetchMisEntries();
    }
  
    this.filteredNames = [];
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    const selDate = this.route.snapshot.paramMap.get('date');
    this.fetchMisEntries();
  }
}
