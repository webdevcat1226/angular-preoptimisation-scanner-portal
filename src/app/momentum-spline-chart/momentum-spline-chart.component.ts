import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-momentum-spline-chart',
  templateUrl: './momentum-spline-chart.component.html',
  styleUrls: ['./momentum-spline-chart.component.scss']
})
export class MomentumSplineChartComponent implements OnInit {
 // value injection
  @Input()
  dataOptions = {home:[],away:[],labels:[],homeName:'',awayName:''};

  @Input()
  labels = [];

  constructor() { }

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      yAxes: [{ display: true}],
      xAxes: [{ display: true}] ,
    },
    elements:{
      point:{
        radius:0
      }
    }
  };
  public lineChartLabels: Label[] = []
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartPlugins = [{
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 5,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 4,
        label: {
          enabled: false,
          content: 'Test label'
        }
      }]
    }
  }];

    public lineChartData: ChartDataSets[] = [];

  ngOnInit(): void {
    this.lineChartLabels = this.labels;
    
    if(this.dataOptions){
       this.lineChartData.push({
         data:this.dataOptions.home,
         label:this.dataOptions.homeName,
         backgroundColor:'green',
         borderColor:'green',
         fill:false,
       })
       this.lineChartData.push({
        data:this.dataOptions.away,
        label:this.dataOptions.awayName,
        backgroundColor:'red',
        borderColor:'red',
        fill:false
      })
    }
  }

}
