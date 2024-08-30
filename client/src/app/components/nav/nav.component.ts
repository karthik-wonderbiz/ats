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
      user = JSON.parse(user).roleId
      this.roleId = parseInt(user!)
      this.isLoggedIn = JSON.parse(user!).pageList.length > 0
    }
  }
}
