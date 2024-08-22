import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
