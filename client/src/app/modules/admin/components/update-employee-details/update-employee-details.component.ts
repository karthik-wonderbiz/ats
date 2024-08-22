import { Component, EventEmitter, Input, Output } from '@angular/core';
import EmployeeModel from '../../../../model/employee-sign-up.model';
import ConfirmPassword from '../../../../model/confirm-password.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http'
import { SignUpService } from '../../../../shared/services/sign-up/sign-up.service';
import { NgForm } from '@angular/forms';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { EmployeeService } from '../../../../services/employee/employee.service';

@Component({
  selector: 'app-update-employee-details',
  templateUrl: './update-employee-details.component.html',
  styleUrl: './update-employee-details.component.css'
})
export class UpdateEmployeeDetailsComponent {
  employee: EmployeeModel = {
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    password: '',
    profilePic: '',
  };
  confirmPass: ConfirmPassword = {
    confirmPassword: '',
  };

  errors = {
    firstName: 'First name must be at least 3 chars!',
    lastName: 'Last name must be at least 1 char!',
    email: 'Enter a valid email!',
    contactNo: 'Phone must be 10 digits!',
    password: 'Pass must be min 8 alphanumerics!',
    confirmPassword: 'Password does not match!',
    profilePic: 'Profile Photo is required!',
  };

  isInvalid = false;
  isSubmitted = false;
  isServerError = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    // private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    // private signupService: SignUpService
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => {
    //   const paramsId = params['id'];
    //   if(paramsId != null){
    //     this.userService.getUserById(paramsId).subscribe((data: UserModel) => {
    //       this.user = data;
    //     });
    //   }
    // });
    const encryptedId = this.route.snapshot.paramMap.get('id');
    console.log("EncryptedId", encryptedId);
    if(encryptedId){
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      console.log('Decrypted Employee ID:', employeeId);
      this.employeeService.getEmployeeByUserId(employeeId).subscribe(data => {
        console.log(data);
        if(data){
          this.employee.firstName = data.firstName;
          this.employee.lastName = data.lastName;
          this.employee.email = data.email;
          this.employee.contactNo = data.contactNo;
          this.employee.profilePic = data.profilePic;
        }
      });
    }
  }

  RegisterEmp(empForm: NgForm): void {
    const loginData: EmployeeModel = {
      firstName: this.employee.firstName,
      lastName: this.employee.lastName,
      email: this.employee.email,
      contactNo: this.employee.contactNo,
      password: this.employee.password,
      profilePic: this.employee.profilePic,
    };
    console.log(loginData);

    // if (this.validateForm()) {
    //   this.employeeService.saveEmployeeData(loginData).subscribe((success) => {
    //     if (success) {
    //       console.log('Data saved successfully');
    //       this.signupService
    //         .saveLoginData(loginData)
    //         .pipe()
    //         .subscribe({
    //           next: (response) => {
    //             console.log(JSON.stringify(response));
    //             // alert(JSON.stringify(response));
    //           },
    //           error: (error) => {
    //             console.log(JSON.stringify(error));
    //             this.isServerError = true;
    //             setTimeout(() => {
    //               this.isServerError = false;
    //             }, 1000);
    //             // alert(JSON.stringify(error));
    //           },
    //           complete: () => {
    //             console.log(JSON.stringify('Complete'));
    //             this.isSubmitted = true;
    //             setTimeout(() => {
    //               this.isSubmitted = false;
    //             }, 1000);
    //             setTimeout(() => {
    //               this.router.navigate(['/login']);
    //             }, 1000);
    //             // alert(JSON.stringify("Complete"));
    //           },
    //         });
    //     }
    //   });
    // } else {
    //   console.log('Validation failed');
    //   this.isInvalid = true;
    //   this.isSubmitted = true;
    //   setTimeout(() => {
    //     this.isSubmitted = false;
    //   }, 900);
    // }
  }

  resetForm(): void {
    this.employee = {
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      password: '',
      profilePic: '',
    };
    this.confirmPass.confirmPassword = '';
  }

  validateForm(): boolean {
    return (
      this.validateName() &&
      this.validateLastName() &&
      this.validateEmail() &&
      this.validatePhone() &&
      this.validatePassword() &&
      this.validateConfirmPassword() &&
      this.validateProfilePic()
    );
  }

  validateName(): boolean {
    const namePattern = /^[a-zA-Z]{3,}$/;
    return namePattern.test(this.employee.firstName);
  }

  validateLastName(): boolean {
    const namePattern = /^[a-zA-Z]{1,}$/;
    return namePattern.test(this.employee.lastName);
  }

  validateEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.employee.email);
  }

  validatePhone(): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(this.employee.contactNo);
  }

  validatePassword(): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
    return regex.test(this.employee.password);
  }

  validateConfirmPassword(): boolean {
    return this.employee.password === this.confirmPass.confirmPassword;
  }

  validateProfilePic(): boolean {
    if (
      this.employee.profilePic == '' ||
      this.employee.profilePic === null ||
      this.employee.profilePic === undefined
    ) {
      return false;
    }
    return true;
  }

  @Input() isNewUser?: boolean;
  @Output() signUpStatusChange = new EventEmitter<boolean>();

  onBackToLogin() {
    this.signUpStatusChange.emit(false);
  }

  thumbnail: SafeUrl | undefined;
  imageId: number | undefined;

  onProfilePicInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (validFileTypes.includes(file.type)) {
        this.errors.profilePic = ''; // Clear any previous error message

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          this.imageToByte(base64String);
          const objectURL = 'data:image/jpeg;base64,' + base64String;
          this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL); // Create a thumbnail for display
        };

        reader.readAsDataURL(file); // Convert file to base64
      } else {
        // Invalid file type, clear the input field and set error message
        this.errors.profilePic = 'Invalid file type!';
        input.value = ''; // Clear the input field
        this.employee.profilePic = ''; // Clear the model value
        this.thumbnail = '';
      }
    } else {
      // Clear the model value if no file is selected
      this.errors.profilePic = 'Profile Photo is required!';
      input.value = ''; // Clear the input field
      this.employee.profilePic = ''; // Clear the model value
      this.thumbnail = '';
    }
  }

  imageToByte(base64String: string): void {
    const imageData = { imageData: base64String };
    this.employee.profilePic = imageData.imageData;
  }
}
