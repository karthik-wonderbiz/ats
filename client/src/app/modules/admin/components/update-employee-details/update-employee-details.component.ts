import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import EmployeeModel from '../../../../model/employee-sign-up.model';
import ConfirmPassword from '../../../../model/confirm-password.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http'
import { SignUpService } from '../../../../shared/services/sign-up/sign-up.service';
import { NgForm } from '@angular/forms';
import { EncryptDescrypt } from '../../../../utils/genericFunction';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-employee-details',
  templateUrl: './update-employee-details.component.html',
  styleUrl: './update-employee-details.component.css'
})

export class UpdateEmployeeDetailsComponent {

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
  confirmPass: ConfirmPassword = {
    confirmPassword: '',
  };

  fName = ''

  errors = {
    firstName: 'First name must be at least 3 chars!',
    lastName: 'Last name must be at least 1 char!',
    profilePic: 'Profile Photo is required!',
  };

  isInvalid = false;
  isSubmitted = false;
  isServerError = false;

  viaCapture = false;

  private initialEmployeeData: EmployeeModel = { ...this.employee };

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private signupService: SignUpService,
    private imageCompress: NgxImageCompressService

  ) { }

  ngOnInit(): void {
    const encryptedId = this.route.snapshot.paramMap.get('id');
    console.log("EncryptedId", encryptedId);
    if (encryptedId) {
      const employeeId = EncryptDescrypt.decrypt(encryptedId);
      console.log('Decrypted Employee ID:', employeeId);
      this.employeeService.getEmployeeByUserId(employeeId).subscribe(data => {
        console.log(data);
        if (data) {
          this.employee.id = data[0].id;
          this.employee.userId = data[0].userId;
          this.employee.firstName = data[0].firstName;
          this.fName = data[0].firstName;
          this.employee.lastName = data[0].lastName;
          this.employee.email = data[0].email;
          this.employee.contactNo = data[0].contactNo;
          this.employee.profilePic = data[0].profilePic;
        }
        this.thumbnail = 'data:image/jpeg;base64,' + this.employee.profilePic;
      });
    }
    this.initialEmployeeData = { ...this.employee };
  }

  isFormDirty(): boolean {
    return JSON.stringify(this.employee) !== JSON.stringify(this.initialEmployeeData);
  }

  toggleCapture() {
    this.viaCapture = !this.viaCapture
  }

  updateUser(empForm: NgForm): void {
    if (this.validateForm()) {
      if (this.employee) {
        const employeeId = this.employee.id;
        console.log(this.employee.id);
        this.employeeService.updateUserById(employeeId, this.employee).pipe().subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Update Successful',
              text: 'Employee details have been updated successfully.',
              timer: 1000
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'There was an error updating the employee details.',
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
            // setTimeout(() => {
            //   this.router.navigate(['/ats/employees']);
              
            // }, 1000);
          }
        });
      }
    }
  }
  
  onUpdateEncoding(){
    setTimeout(() => {
      const encryptedId = EncryptDescrypt.encrypt(this.employee.userId.toString());
      this.router.navigate(['/enrolment/home/', encryptedId]);
    }, 1000);
  }

  setImageFromCamera(e: string) {
    this.thumbnail = e
  }

  validateForm(): boolean {
    return (
      this.validateName() &&
      this.validateLastName() &&
      this.validateProfilePic()
    );
  }

  validateName(): boolean {
    // const namePattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    const namePattern = /^[a-zA-Z ]{3,}$/;
    this.errors.firstName = 'First name must be min 3 chars!';

    if (/\d/.test(this.employee.firstName)) {
      this.errors.firstName = 'Name contains digits!';
      return false;
    } else if (/[^a-zA-Z ]/.test(this.employee.firstName)) {
      this.errors.firstName = 'Name contains special characters!';
      return false;
    }

    return namePattern.test(this.employee.firstName);
  }


  validateLastName(): boolean {
    const namePattern = /^[a-zA-Z ]{1,}$/;
    this.errors.lastName = 'Last name must be min 1 char!';

    if (/\d/.test(this.employee.lastName)) {
      this.errors.lastName = 'Name contains digits!';
      return false;
    } else if (/[^a-zA-Z ]/.test(this.employee.lastName)) {
      this.errors.lastName = 'Name contains special characters!';
      return false;
    }

    return namePattern.test(this.employee.lastName);
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

  convertImage = () => {
    const img = new Image();
    img.src = this.capturedImage;

    img.onload = () => {
      const minDimension = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = minDimension;
      canvas.height = minDimension;
      const context = canvas.getContext('2d');

      if (context) {
        // Calculate the cropping area
        const offsetX = (img.width - minDimension) / 2;
        const offsetY = (img.height - minDimension) / 2;

        // Draw the image onto the canvas, cropping to a square
        context.drawImage(
          img,
          offsetX, offsetY, minDimension, minDimension,  // source rectangle
          0, 0, minDimension, minDimension  // destination rectangle
        );

        // Convert canvas to base64 string
        const croppedBase64String = canvas.toDataURL('image/jpeg').split(',')[1];

        // Check file size
        const fileSizeInKB = (croppedBase64String.length * (3 / 4)) / 1024;
        console.log(fileSizeInKB);
        if (fileSizeInKB > 1024) {
          this.errors.profilePic = 'File size exceeds 1024kb!';
          this.employee.profilePic = '';
          return;
        }
        // Resize the image if necessary and then handle the result
        this.imageCompress.compressFile('data:image/jpeg;base64,' + croppedBase64String, -1, 50, 50, 180, 180).then((resizedImage) => {
          const resizedBase64String = resizedImage.split(',')[1];
          this.imageToByte(resizedBase64String);
          const objectURL = 'data:image/jpeg;base64,' + resizedBase64String;
          this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
      }
    };
  }

  onProfilePicInput(event: Event): void {
    this.isCaptured = true
    this.thumbnail = ""
    this.employee.profilePic = ""

    const input = event.target as HTMLInputElement;
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (validFileTypes.includes(file.type)) {
        this.errors.profilePic = '';
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result as string;
          this.capturedImage = base64String;
          this.thumbnail = base64String
          this.convertImage();
        };

        reader.readAsDataURL(file); // Convert file to base64
      } else {
        // Invalid file type
        this.errors.profilePic = 'Invalid file type!';
        input.value = ''; // Clear the input field
        this.employee.profilePic = ''; // Clear the model value
        this.thumbnail = '';
      }
    } else {
      // No file selected
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

  isCamOpen: boolean = false;
  isCaptured: boolean = false;
  private stream: MediaStream | null = null;
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  capturedImage: string = ""

  openCamera() {
    console.log("call")
    this.thumbnail = ''
    this.isCaptured = false
    this.initializeWebcam()
  }
  async removeCurrent() {
    await this.capture()
  }

  ngOnDestroy(): void {
    this.stopWebcam();
  }

  async capture(): Promise<void> {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      if (imageBlob) {
        this.stopWebcam()
        this.isCaptured = true
        const reader = new FileReader();
        reader.onloadend = () => {
          this.capturedImage = reader.result as string;
          this.thumbnail = this.capturedImage;
          this.isCamOpen = false;
          this.employee.profilePic = this.capturedImage
          this.convertImage()
        };
        reader.readAsDataURL(imageBlob);
      }
    }
  }

  initializeWebcam(): void {
    const video: HTMLVideoElement | null = document.getElementById(
      'video'
    ) as HTMLVideoElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream: MediaStream) => {
          if (video) {
            video.srcObject = stream;
            this.stream = stream;
            this.isCamOpen = true
          }
        })
        .catch((error: any) => {
          console.error('Error accessing webcam: ', error);
        });
    } else {
      console.error('getUserMedia not supported in this browser.');
    }
  }

  stopWebcam(): void {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
      this.isCamOpen = false
    }
  }
  onDelete(){
    this.errors.profilePic = 'Profile Photo is required!';
      this.employee.profilePic = ''; // Clear the model value
      this.thumbnail = '';
      this.isCamOpen = false
      this.isCaptured =false
  }

  onBrowse(){
    this.stopWebcam()
  }

}
