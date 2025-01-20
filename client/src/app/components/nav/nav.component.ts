import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  roleId: number = 2;
  ngOnInit() {
    let user = localStorage.getItem("user")
    if (user) {
      user = JSON.parse(user).roleId
      this.roleId = parseInt(user!)
    }

  }
}
