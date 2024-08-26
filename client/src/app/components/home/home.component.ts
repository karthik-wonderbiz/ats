import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/enrolment/user.service';
import Toast from '../../model/enrolment/toast.model';
import User from '../../model/enrolment/user.model';
import EmployeeModel from '../../model/employee-sign-up.model';
import { EncryptDescrypt } from '../../utils/genericFunction';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @Output() closeToast = new EventEmitter();
  constructor(private userService: UserService, private route: ActivatedRoute) { }
  isClose: boolean = false;
  toast: Toast = {
    position: 'bottom',
    message: '',
    type: 'error',
  };
  onClose = () => {
    this.isClose = false;
  };
  isUser: boolean = false;
  user: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    designationName: '',
    email: '',
    id: 0,
    // profilePicture: new Blob([]),
    profilePic: '',
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      const encryptedId = params['userId']; 
      this.user.userId = parseInt(EncryptDescrypt.decrypt((encryptedId)));
      this.getUser(); 
    });
  }

  getUser = () => {
    console.log(this.user.userId);
    this.userService.getUserById(this.user.userId).subscribe({
      next: (data) => {
        const { designationName, firstName, lastName, profilePic, id } = data;
        this.user.firstName = firstName;
        this.user.lastName = lastName;
        this.user.designationName = designationName;
        this.user.profilePic = profilePic;
        this.isUser = true;
        this.user.id = id;
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: (err) => {
        this.toast.message = err.message || 'User not found';
        this.isClose = true;
        setTimeout(() => {
          this.isClose = false;
        }, 4000);
      },
    });
  };
}
