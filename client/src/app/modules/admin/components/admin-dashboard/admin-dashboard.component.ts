import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  isLogged = true;
  isNewUser = false;
  isOn = true;

  toggle() {
    this.isOn = !this.isOn;
  }

  toggleOff() {
    if (!this.isOn) {
      this.isOn = !this.isOn;
    }
  }

  onLoginStatusChange(loggedIn: boolean) {
    this.isLogged = loggedIn;
  }

  onSignUpStatusChange(isNewUser: boolean) {
    this.isNewUser = isNewUser;
  }

  constructor() { }

}
