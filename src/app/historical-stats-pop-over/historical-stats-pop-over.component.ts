import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historical-stats-pop-over',
  templateUrl: './historical-stats-pop-over.component.html',
  styleUrls: ['./historical-stats-pop-over.component.scss']
})
export class HistoricalStatsPopOverComponent implements OnInit {

  @Input()
  dataOptions = [];

  @Input()
  league ;

  @Input()
  preMatchOdds;

  @Input()
  homeId;

  @Input()
  type

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  //btn btn-primary btn-circle 


  getClass(option){
    if(option && option.matchResult==1){
      return 'btn btn-grey btn-circle right-10 bottom-5';
    } else if (option && option.matchResult==0){
      return 'btn btn-red btn-circle right-10 bottom-5' ;
    } else if (option && option.matchResult==2){
      return 'btn btn-green btn-circle right-10 bottom-5';
    }
  }

  viewInfo(){
    this.router.navigateByUrl('/form/'+this.homeId+"/"+this.type,{skipLocationChange:true});
  }

  isLight(){
    return environment.theme=='light'
  }

}
