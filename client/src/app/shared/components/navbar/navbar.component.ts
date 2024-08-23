import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeInfoModel } from '../../../model/EmployeeInfo.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // Import Router for navigation
import { EncryptDescrypt } from '../../../utils/genericFunction'; // Import your encryption utility

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

  constructor(
    private employeeService: EmployeeService,
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      this.logindata = JSON.parse(storedData);
      if (this.logindata.id) {
        this.fetchEmployeeInfo(this.logindata.id);
      }
    }
  }

  logout() {
    if(this.logindata){
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
            showConfirmButton: false,
            text: 'You have been logged out successfully.',
            timer: 2000
          }).then(() => {
            window.location.href = '/'; // Redirect after the alert
          });
        }
      });
    }    
  }

  fetchEmployeeInfo(id: string): void {
    this.employeeService.getEmployeeByUserId(id).subscribe(employee => {
      this.employeeInfo = employee;
    });
  }

  navigateToProfile(): void {
    if (this.logindata && this.logindata.id) {
      const encryptedId = EncryptDescrypt.encrypt(this.logindata.id.toString());
      this.router.navigate(['/admin/employee-detail', encryptedId]);
    } else {
      console.error('User ID is missing or data is incorrect');
    }
  }

  onToggle(): void {
    this.toggle.emit();
  }

  onToggleOff(): void {
    this.toggleOff.emit();
  }
}
