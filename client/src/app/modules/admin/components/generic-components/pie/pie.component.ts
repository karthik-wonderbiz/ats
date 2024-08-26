import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnChanges {

  @Input() title: string = 'Pie Chart';
  @Input() pieChartDataJson: any[] = [];
  @Input() pieChartLabelsKey: string = 'label'; // Key for labels in pieChartDataJson
  @Input() pieChartValuesKey: string = 'value'; // Key for values in pieChartDataJson
  @Input() pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 12,
          color: 'black'
        }
      }
    }
  };
  @Input() pieChartLegend: boolean = true;
  @Input() pieChartPlugins: any[] = [];
  
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartDataset<'pie'>[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartDataJson'] && this.pieChartDataJson.length) {
      this.pieChartLabels = this.pieChartDataJson.map(item => item[this.pieChartLabelsKey]);
      this.pieChartDatasets = [{
        data: this.pieChartDataJson.map(item => item[this.pieChartValuesKey]),
        backgroundColor: this.getColors(this.pieChartDataJson.length)
      }];
    }
  }

  // Method to generate colors for each slice of the pie chart
  private getColors(length: number): string[] {
    // Define your custom color palette
    const colors = ['#22C55E', '#EF4444'];
    return Array.from({ length }, (_, i) => colors[i % colors.length]);
  }
  

  onChartHover($event: any) {
    // Handle hover event
  }

  onChartClick($event: any) {
    // Handle click event
  }

  constructor() { }
}
