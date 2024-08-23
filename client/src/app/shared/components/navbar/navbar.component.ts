import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeInfoModel } from '../../../model/EmployeeInfo.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isOn?: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleOff = new EventEmitter<void>();
  logindata: any;

  employeeInfo: any = {};

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      this.logindata = JSON.parse(storedData);
      if (this.logindata.id) {
        console.log(this.logindata.id);
        this.fetchEmployeeInfo(this.logindata.id);
      }
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('loginData');
        this.logindata = null;
        this.employeeInfo = {};
        this.isOn = false;
        this.toggleOff.emit();
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          timer: 2000
        }).then(() => {
          window.location.href = '/'; // Redirect after the alert
        });
      }
    });
  }
  

  fetchEmployeeInfo(id: string): void {
    this.employeeService.getEmployeeByUserId(id).subscribe(employee => {
      this.employeeInfo = employee;
      console.log("Employee info by login",this.employeeInfo);
    });
  }

  onToggle(): void {
    this.toggle.emit();
  }

  onToggleOff(): void {
    this.toggleOff.emit();
  }
}
