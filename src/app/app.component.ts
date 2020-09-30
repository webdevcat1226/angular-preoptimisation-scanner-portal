import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit  {
  title = 'soccerStatisticsUI';

  constructor(private elementRef: ElementRef, private messageService: MessageService){

  }

  ngOnInit() {
      //alert(window.innerWidth);
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.className = 'base-background';
  }

  //private elementRef: ElementRef

}
