import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnChanges {

  @Input() title: string = 'bar-chart';
  @Input() barChartDataJson: string = '{}';
  @Input() barChartOptionsJson: string = '{}';
  @Input() barChartLegend: boolean = true;
  @Input() barChartPlugins: any[] = [];

  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    },
    plugins:{
      legend:{
        display: true,
        position: 'top',
        labels:{
          boxWidth: 12,
          color : 'black'
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['barChartDataJson']) {
      this.barChartData = JSON.parse(this.barChartDataJson);
    }
    if (changes['barChartOptionsJson']) {
      this.barChartOptions = JSON.parse(this.barChartOptionsJson);
    }
  }

  onChartHover(event: any): void {
    //console.log('Chart Hovered:', event);
  }

  onChartClick(event: any): void {
    //console.log('Chart Clicked:', event);
  }

  constructor() { }
}
