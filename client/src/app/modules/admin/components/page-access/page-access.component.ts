import { Component } from '@angular/core';

@Component({
  selector: 'app-page-access',
  templateUrl: './page-access.component.html',
  styleUrls: ['./page-access.component.css'],
})
export class PageAccessComponent {
  selectedRole: string = '1';
  pages: any[] = [
    { pageName: 'Dashboard', check: false },
    { pageName: 'Employee Management', check: false },
    { pageName: 'Attendance Logs', check: false },
    { pageName: 'Reports', check: false },
    { pageName: 'Settings', check: false },
    { pageName: 'Dashboard', check: false },
    { pageName: 'Employee Management', check: false },
    { pageName: 'Attendance Logs', check: false },
    { pageName: 'Reports', check: false },
  ];

  columns = [
    { key: 'pageName', label: 'Page Name' },
    { key: 'check', label: 'Select' },
  ];

  saveAccessSettings() {
    const pageAccessData = {
      role: this.selectedRole,
      pages: this.pages,
    };

    console.log('Access Settings:', pageAccessData);
  }
}
