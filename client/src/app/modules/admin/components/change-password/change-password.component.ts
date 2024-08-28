import { Component } from '@angular/core';
import EmployeeModel from '../../../../model/employee-sign-up.model';
import ConfirmPassword from '../../../../model/confirm-password.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { NgForm } from '@angular/forms';
import ChangePassword from '../../../../model/change-password.model';
import { ChangePasswordService } from '../../../../services/change-password/change-password.service';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../../../services/employee/employee.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  changePassword : ChangePassword = {
    email: '',
    oldPassword: '',
    newPassword: '',
    userId : ''
  }

  confirmPass: ConfirmPassword = {
    confirmPassword: '',
  }

  employee: EmployeeModel = {
    id: '',
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    password: '',
    profilePic: ''
  };

  errors = {
    email: 'Enter a valid email!',
    oldPassword: 'Pass must be min 8 alphanumerics!',
    newPassword: 'Pass must be min 8 alphanumerics!',
    confirmPassword: 'Password does not match!',
  };

  isInvalid = false;
  isSubmitted = false;
  isServerError = false;

  serverError = ''

  pType: string = "password";
  eye: boolean = true

  constructor(
    private changePasswordService: ChangePasswordService,
    private router: Router,
    private route : ActivatedRoute,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void { 
    const userData = localStorage.getItem('loginData')
    console.log(userData)
    if(userData){
      this.changePassword.email = JSON.parse(userData).email
    }
    
  }

  viewPass() {
    this.pType = this.pType == "password" ? "text" : 'password'
    this.eye = !this.eye
  }

  updatePassword(empForm: NgForm): void {
    if (this.validateForm()) {
      if (this.changePassword) {
        const employeeId = this.changePassword.userId;
        console.log(this.changePassword.userId);
        this.changePasswordService.updatePasswordById(employeeId, this.changePassword).pipe().subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Update Successful',
              text: 'Password has been updated successfully.',
              timer: 1000
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'There was an error updating the password.',
              timer: 1000
            });
          },
          complete: () => {
            Swal.fire({
              icon: 'success',
              title: 'Update Complete',
              showConfirmButton: false,
              text: 'The update process has completed.',
              timer: 1000
            });
          }
        });
      }
    }
  }

  validateForm(): boolean {
    return (
      this.validatePassword() &&
      this.validateConfirmPassword() 
    );
  }

  validatePassword(): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

    if (!regex.test(this.changePassword.newPassword)) {
      if (!/(?=.*[a-z])/.test(this.changePassword.newPassword)) {
        this.errors.newPassword = "Pass should've at least 1 lowercase!";
      } else if (!/(?=.*[A-Z])/.test(this.changePassword.newPassword)) {
        this.errors.newPassword = "Pass should've at least 1 uppercase!";
      } else if (!/(?=.*\d)/.test(this.changePassword.newPassword)) {
        this.errors.newPassword = "Pass should've at least 1 digit!";
      } else if (!/(?=.*[^A-Za-z\d])/.test(this.changePassword.newPassword)) {
        this.errors.newPassword = "Pass should've at least 1 special char!";
      } else {
        this.errors.newPassword = "Pass must be at least 8 char long!";
      }
      return false;
    }

    this.errors.newPassword = '';
    return true;
  }

  validateConfirmPassword(): boolean {
    return this.changePassword.newPassword === this.confirmPass.confirmPassword;
  }
}
