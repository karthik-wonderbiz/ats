import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  roleId: number = 2;
  isLoggedIn: boolean = false;
  ngOnInit() {
    let user = localStorage.getItem("user")
    if (user) {
      this.isLoggedIn = JSON.parse(user ? user : JSON.stringify({ isLoggedIn: false })).isLoggedIn
      user = JSON.parse(user).roleId
      this.roleId = parseInt(user!)
      console.log(this.isLoggedIn)
    }
  }
}
