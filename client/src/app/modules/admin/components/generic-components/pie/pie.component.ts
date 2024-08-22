import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnChanges {

  @Input() title: string = 'pie-chart';
  @Input() pieChartDataJson: any[] = [];
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
  public pieChartLabels: string[][] = [];
  public pieChartDatasets: { data: number[] }[] = [];
  public pieChartLegend: boolean = true;
  public pieChartPlugins: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartDataJson'] && this.pieChartDataJson.length) {
      // Assuming pieChartDataJson is an array of objects with 'label' and 'value' properties
      this.pieChartLabels = this.pieChartDataJson.map(item => [item.label]);
      this.pieChartDatasets = [{ data: this.pieChartDataJson.map(item => item.value) }];
    }
  }

  onChartHover($event: any) {
    // window.console.log('onChartHover', $event);
  }

  onChartClick($event: any) {
    // window.console.log('onChartClick', $event);
  }

  constructor() { }
}
