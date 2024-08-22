import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnChanges {
  
  @Input() title: string = 'line-chart';
  @Input() lineChartDataJson: string = '{}';
  @Input() lineChartOptionsJson: string = '{}';
  @Input() lineChartLegend: boolean = true;

  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins:{
      legend:{
        labels:{
          boxWidth: 12
        }
      }
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lineChartDataJson']) {
      this.lineChartData = JSON.parse(this.lineChartDataJson);
    }
    if (changes['lineChartOptionsJson']) {
      this.lineChartOptions = JSON.parse(this.lineChartOptionsJson);
    }
  }

  constructor() {}
}
