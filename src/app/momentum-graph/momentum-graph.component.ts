import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-momentum-graph',
  templateUrl: './momentum-graph.component.html',
  styleUrls: ['./momentum-graph.component.scss']
})
export class MomentumGraphComponent implements OnInit {

  @Input()
  dataOptions = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips:{
      enabled:false
    },
    hover:{
      
    },
    scales: { 
      yAxes: [{ display: false}],
      xAxes: [{ display: false}] ,
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

    public barChartData: ChartDataSets[] = [
      { 
        data: [65, 59, 80, 81, 56],
        backgroundColor:['green','green','green','green','green']
      }
    ];
  constructor() { }

  isLight(){
    return environment.theme=='light'
  }

  ngOnInit(): void {
    if(this.dataOptions && this.dataOptions.length){
      this.barChartData[0].data=this.dataOptions;
      let colors = [];
      this.barChartData[0].backgroundColor=colors
      this.barChartData[0].barPercentage=1.0
      this.barChartData[0].categoryPercentage=1.0
      var count=0
      this.dataOptions.forEach(option=>{
        this.barChartLabels.push((++count)+'')
        if(option<0){
          colors.push('red')
        } else{
          colors.push('green')
        }
      })
    }
  }

}
