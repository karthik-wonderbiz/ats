import { Component } from '@angular/core';

@Component({
  selector: 'app-page-access',
  templateUrl: './page-access.component.html',
  styleUrls: ['./page-access.component.css'] // Corrected to 'styleUrls'
})
export class PageAccessComponent {
  pages: any[] = [
    { pageName: 'Dashboard', check: false },
    { pageName: 'Employee Management', check: false },
    { pageName: 'Attendance Logs', check: false },
    { pageName: 'Reports', check: false },
    { pageName: 'Settings', check: false }
  ];

  columns = [
    { key: 'pageName', label: 'Page Name' },
    { key: 'check', label: 'Select' }
  ];
}
