import {Component, OnInit, Input} from '@angular/core';
import {PlayService} from './../play.service'
import * as moment from 'moment'; // add this 1 of 4
import {MessageService} from '../message.service';
import {environment} from 'src/environments/environment';
import {Subscription} from 'rxjs';
import {trigger, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          // style({transform: 'translateY(0)', opacity: 0.8}),
          // animate('500ms', style({transform: 'translateY(100%)', opacity: 1}))
          style({height: '0px', opacity: 0}),
          animate('500ms', style({height: '*', opacity: 1}))
        ]),
        transition(':leave', [
          // style({transform: 'translateY(0)', opacity: 1}),
          // animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
          // style({transform: 'translateX(0)', opacity: 1}),
          // animate('500ms', style({transform: 'translateX(100%)', opacity: 1}))
          style({height: '*', opacity: 1}),
          animate('500ms', style({height: '0px', opacity: 0}))
        ])
      ]
    )
  ],
})
export class HomeComponent implements OnInit {


  currentDate = new Date();
  results;
  momentumValue;
  grids = [];
  loaded = false;
  matches;
  userPredictions = [];
  preMatchFlag = false;
  preHeight = 0;

  constructor(private service: PlayService, private messageService: MessageService) {

  }

  isLight() {
    return environment.theme === 'light';
  }

  addNewGrid() {
    const grid = {
      name: "Grid Example " + (this.grids.length + 1),
      matches: this.matches
    }
    this.grids.push(grid);
  }

  getGridName(i) {
    return "Grid Example " + i;
  }

  getMomentumValueForSpline(graphData) {
    const data = graphData;
    const array = [];
    if (data) {
      const jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (const key of Object.keys(jsonGraph)) {
        array.push(jsonGraph[key])
      }
    }
    return array;
  }

  getLabel(graphData) {
    const data = graphData;
    const array = [];
    if (data) {
      const jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (const key of Object.keys(jsonGraph)) {
        if (jsonGraph[key] >= 0) {
          array.push((parseInt(key + '', 10) + 1) + '')
        }
      }
    }

    return array;
  }

  getMomentumValue(inMatch) {
    const data = inMatch.momentumGraph.graphData;
    const array = [];
    if (data) {
      const jsonGraph = JSON.parse(data.replace("/\/g", ""));

      for (const key of Object.keys(jsonGraph)) {
        if (jsonGraph[key] !== '0' && array.length < 20) {
          array.push(jsonGraph[key])
        }
      }
    }
    return array;
  }

  showPredictionTable() {
    this.preMatchFlag = !this.preMatchFlag;
  }

  ngOnInit(): void {
    this.service.getPlayResults().subscribe(response => {
      this.results = response.matches;
      const matches = this.results.filter(match => {
        match.kickOffTime = moment(match.kickOffTime);
        if (environment.fullGridLoad) {
          return true;
        }
        if (match.kickOffTime.toDate() > moment().subtract({days: environment.gridLoadBeforeDays}).toDate()) {
          return true;
        }
        return false;
      });
      matches.forEach(inMatch => {
        inMatch.splineGraphDataHome1 = this.getMomentumValueForSpline(
          inMatch.attackingPressureGraphs[0].graphData);
        inMatch.splineGraphDataAway1 = this.getMomentumValueForSpline(
          inMatch.attackingPressureGraphs[2].graphData);
        inMatch.splineGraphDataHome2 = this.getMomentumValueForSpline(
          inMatch.attackingPressureGraphs[1].graphData);
        inMatch.splineGraphDataAway2 = this.getMomentumValueForSpline(
          inMatch.attackingPressureGraphs[3].graphData);


        inMatch.graphicalData1 = {home: [], away: []}
        inMatch.graphicalData1.home = inMatch.splineGraphDataHome1
        inMatch.graphicalData1.away = inMatch.splineGraphDataAway1
        inMatch.graphicalData1.homeName = inMatch.homeName
        inMatch.graphicalData1.awayName = inMatch.awayName

        inMatch.graphicalData2 = {home: [], away: []}
        inMatch.graphicalData2.home = inMatch.splineGraphDataHome2
        inMatch.graphicalData2.away = inMatch.splineGraphDataAway2
        inMatch.splineGraphLabel = this.getLabel(inMatch.attackingPressureGraphs[1].graphData)
        inMatch.graphicalData2.homeName = inMatch.homeName
        inMatch.graphicalData2.awayName = inMatch.awayName

        inMatch.barGraphData = this.getMomentumValue(inMatch)
        inMatch.battleWith = inMatch.homeName + " vs " + inMatch.awayName;
        inMatch.bell = false;
      });
      this.matches = matches;
      this.addNewGrid()
      this.loaded = true;
    })

    this.service.getPredictionsManagerResults().subscribe(response => {
      this.userPredictions = response.result.userPredictions;
      this.preHeight = this.userPredictions.length * 48
    })

    this.messageService.removeGridEvent.subscribe(value => {
      if (value > -1 && this.grids.length) {
        this.grids.splice(value, 1);
      }
    })
  }

}
