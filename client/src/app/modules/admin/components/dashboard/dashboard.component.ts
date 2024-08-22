import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  pieChartData = [
    { label: 'Present', value: 300 },
    { label: 'Absent', value: 50 },
  ];

  barChartDataJson: string = JSON.stringify({
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 91, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 96, 27, 90], label: 'Series B' },
    ]
  });

  lineChartDataJson: string = JSON.stringify({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [1, 12, 30, 51, 93, 55, 40],
        label: 'Series A',
      },
      {
        data: [63, 45, 10, 78, 51, 95, 80],
        label: 'Series B',
      }
    ]
  });

  eventJsonData: string = JSON.stringify([
    { title: 'Absent', date: '2024-08-02', type: 'absent' },
    { title: 'Present', date: '2024-08-03', type: 'present' },
    { title: 'Present', date: '2024-09-03', type: 'present' },
  ]);
}
