import {Component, OnInit, Input} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {
  MAIN_COLUMN_VISIBILITY_FIELD,
  PREVIOUS_COLUMN_VISIBILITY_FIELD,
  MISC_VISIBILITY_FIELD,
  QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG,
  QUICK_FILTERS_MISC_CONFIG,
  PREV_SELECT_OPTIONS
} from '../../config/grid-settings-config';
import {MessageService} from '../../message.service';
import {environment} from 'src/environments/environment';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-score-grid',
  templateUrl: './score-grid.component.html',
  styleUrls: ['./score-grid.component.scss']
})
export class ScoreGridComponent implements OnInit {

  // bells = []

  constructor(private modalService: NgbModal, private messageService: MessageService) {
    ScoreGridComponent.components.push(this);
  }
  public static components: ScoreGridComponent[] = [];

  defaultMainColumnVisibility = MAIN_COLUMN_VISIBILITY_FIELD;
  previousStatsColumnVisibility = PREVIOUS_COLUMN_VISIBILITY_FIELD;
  miscStatsColumnVisibility = MISC_VISIBILITY_FIELD;
  options = PREV_SELECT_OPTIONS;

  defaultGamesCurrentlyInFilters = QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG;
  defaultMiscFilters = QUICK_FILTERS_MISC_CONFIG;

  gamesCurrentlyInFilters = [];
  miscFilters = [];

  searchValue;

  activeMainColumnVisibility = []

  activePreviousStatsColumnVisibility = [];

  activeMiscStatsColumnVisibility = []

  activeFilters = [];

  scoreFilters = [];

  closeResult = '';

  @Input()
  grid;

  sortedData = [];

  baseMatchRecords;

  @Input()
  gridName;

  @Input()
  gridNumber;

  lastTimeSelection = PREV_SELECT_OPTIONS[0];

  hide = false;

  type;

  gridNameEdit = false;

  color;

  public static setColorFromHeader(color) {
    ScoreGridComponent.components[0].color = color;
  }

  ngOnInit(): void {
    this.sortedData = this.grid.matches;
    this.activeMainColumnVisibility = JSON.parse(JSON.stringify(this.defaultMainColumnVisibility));
    this.activePreviousStatsColumnVisibility = JSON.parse(JSON.stringify(this.previousStatsColumnVisibility))
    this.activeMiscStatsColumnVisibility = JSON.parse(JSON.stringify(this.miscStatsColumnVisibility))
    this.gamesCurrentlyInFilters = JSON.parse(JSON.stringify(this.defaultGamesCurrentlyInFilters))
    this.miscFilters = JSON.parse(JSON.stringify(this.defaultMiscFilters))
    this.baseMatchRecords = JSON.parse(JSON.stringify(this.grid.matches));
    this.messageService.publishVisibilityEvent.subscribe(publishData => {
      if (this.gridNumber === publishData.gridNumber) {
        this.hide = true;
        this.activeMainColumnVisibility = publishData.activeMainColumnVisibility
        this.activeMiscStatsColumnVisibility = publishData.activeMiscStatsColumnVisibility
        this.activePreviousStatsColumnVisibility = publishData.activePreviousStatsColumnVisibility
        setTimeout(() => {
          this.hide = false
        }, 2);
      }
    })

    if (this.isLight()) {
      this.color = '#146853';
    } else {
      this.color = '#ffd000';
    }

    this.messageService.publishQuickFiltersEvent.subscribe(data => {
      if (this.gridNumber === data.gridNumber) {
        this.gamesCurrentlyInFilters = data.gamesCurrentlyInFilters;
        this.miscFilters = data.miscFilters
        this.applyQuickFilters();
      }
    })

    this.messageService.statsFilterEvent.subscribe(data => {
      if (data.gridNumber === this.gridNumber) {
        this.activeFilters = data.filters;
        this.scoreFilters = data.scoreFilters;
        this.applyFilters(data.filters);
        this.applyScoreFilters(data.scoreFilters);
      }
    })

    this.messageService.applyColorToGridEvent.subscribe(colorPublishData => {
      if (colorPublishData.gridNumber === this.gridNumber) {
        this.color = colorPublishData.color;
      }
    })

    environment.headerWidth = "responsive";


  }

  applyScoreFilters(filters) {
    this.sortedData = this.sortedData.filter(match => {
      if (filters && filters.length) {
        return filters.indexOf(match.score) > -1;
      }
      return true;
    })
  }

  applyQuickFilters() {
    const sortedData = JSON.parse(JSON.stringify(this.baseMatchRecords)).filter(match => match)
    if (this.gamesCurrentlyInFilters && this.gamesCurrentlyInFilters.length) {
      let firstHalfCheck = false;
      let secondHalfCheck = false;
      let halfTimeCheck = false;
      let showAllCheck = true
      this.gamesCurrentlyInFilters.forEach(filterOption => {
        if (filterOption.key === 'firstHalf') {
          firstHalfCheck = filterOption.applyFilter;
        }
        if (filterOption.key === 'secondHalf') {
          secondHalfCheck = filterOption.applyFilter;
        }
        if (filterOption.key === 'halfTime') {
          halfTimeCheck = filterOption.applyFilter;
        }

        if (filterOption.key === 'showAll') {
          showAllCheck = filterOption.applyFilter;
        }
      })

      let drawCheck = false;
      let underdogCheck = false;
      let lowMomentumCheck = false;
      let highMomentumCheck = false;
      this.miscFilters.forEach(filterOption => {
        if (filterOption.key === 'draw') {
          drawCheck = filterOption.applyFilter;
        }
        if (filterOption.key === 'underdogWinning') {
          underdogCheck = filterOption.applyFilter;
        }
        if (filterOption.key === 'lowAp') {
          lowMomentumCheck = filterOption.applyFilter;
        }
        if (filterOption.key === 'highAp') {
          highMomentumCheck = filterOption.applyFilter;
        }
      });

      this.sortedData = sortedData.filter(match => {
        let retValue = showAllCheck;
        const gameTime = parseInt(match.gameTime + '', 10)
        if (halfTimeCheck) {
          retValue = gameTime === 45
        }

        if (firstHalfCheck) {
          retValue = retValue || gameTime < 45
        }

        if (secondHalfCheck) {
          retValue = retValue || gameTime > 45
        }

        return retValue;
      });

      this.sortedData = this.sortedData.filter(match => {
        if (drawCheck) {
          return (match.statistics.totalAwayGoals + '' === match.statistics.totalHomeGoals + '')
        }
        return true;
      });

      this.sortedData = this.sortedData.filter(match => {
        if (underdogCheck) {
          let isReallyUnderDogPerformance = false;

          if (match && match.preMatchOdds) {
            const underdogBase1 = (parseFloat(match.preMatchOdds.homeOdds) <= 1.5) && (parseFloat(match.preMatchOdds.awayOdds) >= 5.0);
            const underdogBase2 = (parseFloat(match.preMatchOdds.awayOdds) <= 1.5) && (parseFloat(match.preMatchOdds.homeOdds) >= 5.0);
            if (underdogBase1 && (parseInt(match.statistics.totalAwayGoals, 10) > parseInt(match.statistics.totalHomeGoals, 10))) {
              isReallyUnderDogPerformance = true;
            } else if (underdogBase2 && (parseInt(match.statistics.totalHomeGoals, 10) > parseInt(match.statistics.totalAwayGoals, 10))) {
              isReallyUnderDogPerformance = true;
            }
          }

          return isReallyUnderDogPerformance;
        }
        return true;
      })

      this.sortedData = this.sortedData.filter(match => {
        if (lowMomentumCheck) {
          let isReallyWithLowMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (parseInt(match.homeLast20.pressureIndex, 10) <= 30 && parseInt(match.awayLast20.pressureIndex, 10) <= 30) {
              isReallyWithLowMomentum = true;
            }
          }

          return isReallyWithLowMomentum;
        }
        return true;
      })

      this.sortedData = this.sortedData.filter(match => {
        if (highMomentumCheck) {
          let isReallyWithHighMomentum = false;

          if (match && match.homeLast20 && match.awayLast20) {
            if (parseInt(match.homeLast20.pressureIndex, 10) >= 60 && parseInt(match.awayLast20.pressureIndex, 10) >= 30) {
              isReallyWithHighMomentum = true;
            }
          }

          return isReallyWithHighMomentum;
        }
        return true;
      })

    }
  }

  applyFilters(filters) {
    if (!filters.length) {
      this.sortedData = this.baseMatchRecords.filter(match => match);
    } else {
      this.sortedData = JSON.parse(JSON.stringify(this.baseMatchRecords)).filter(match => match);
      filters.forEach(filter => {
        const field = filter.statType.key;
        const operator = filter.filterType.key;
        const value = filter.filterValue
        this.sortedData = this.generateFilteredData(field, operator, value);
      })
    }

  }


  generateFilteredData(field, operator, value) {
    const sortedData = this.sortedData;
    return sortedData.filter(match => {
      if (operator === 'equals') {
        return match.statistics[field] === value
      } else if (operator === 'lessThan') {
        return parseInt(match.statistics[field] + '', 10) < parseInt(value + '', 10)
      } else if (operator === 'lessThanEquals') {
        return parseInt(match.statistics[field] + '', 10) <= parseInt(value + '', 10)
      } else if (operator === 'greaterThan') {
        return parseInt(match.statistics[field] + '', 10) > parseInt(value + '', 10)
      } else if (operator === 'greaterThanEquals') {
        return parseInt(match.statistics[field] + '', 10) >= parseInt(value + '', 10)
      }
      return true;
    })
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ScoreGridComponent.getDismissReason(reason)}`;
    });
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selectBell(match) {
    match.bell = !match.bell
  }

  public isVisible(type, key) {
    let visibility = true;
    if (type === 'main') {
      this.activeMainColumnVisibility.forEach(condition => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      })
    } else if (type === 'previous') {
      this.activePreviousStatsColumnVisibility.forEach(condition => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      })
    } else if (type === 'misc') {
      this.activeMiscStatsColumnVisibility.forEach(condition => {
        if (condition && condition.key === key) {
          visibility = condition.visible;
        }
      })
    }
    return visibility;
  }

  removeMatch(matchId) {
    this.sortedData = this.sortedData.filter(match => {
      return match.matchId !== matchId;
    });
  }

  gridToggle() {
    this.gridNameEdit = true;
  }

  isLight() {
    return environment.theme === 'light';
  }

  selectDropdownValue(value) {
    this.lastTimeSelection = value;
  }

  saveEditable() {
    this.grid.name = this.gridName;
    this.gridNameEdit = false;
  }

  cancelEditable() {
    this.gridName = this.grid.name
    this.gridNameEdit = false;
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    alert(sort.active)
    alert(sort.direction)
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.grid.matches;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'gameTime':
          return compare(parseInt(a.gameTime, 10), parseInt(b.gameTime, 10), isAsc);
        case 'totalGoals':
          return compare(parseInt(a.statistics.totalGoals, 10), parseInt(b.statistics.totalGoals, 10), isAsc);
        case 'totalAttacks':
          return compare(parseInt(a.statistics.totalAttacks, 10), parseInt(b.statistics.totalAttacks, 10), isAsc);
        case 'totalDangerousAttacks':
          return compare(parseInt(a.statistics.totalDangerousAttacks, 10), parseInt(b.statistics.totalDangerousAttacks, 10), isAsc);
        case 'totalOffTarget':
          return compare(parseInt(a.statistics.totalOffTarget, 10), parseInt(b.statistics.totalOffTarget, 10), isAsc);
        case 'totalOnTarget':
          return compare(parseInt(a.statistics.totalOnTarget, 10), parseInt(b.statistics.totalOnTarget, 10), isAsc);
        case 'totalCorners':
          return compare(parseInt(a.statistics.totalCorners, 10), parseInt(b.statistics.totalCorners, 10), isAsc);
        case 'totalYellowCards':
          return compare(parseInt(a.statistics.totalYellowCards, 10), parseInt(b.statistics.totalYellowCards, 10), isAsc);
        case 'totalRedCards':
          return compare(parseInt(a.statistics.totalRedCards, 10), parseInt(b.statistics.totalRedCards, 10), isAsc);
        // case 'totalPossession': return compare(parseInt(a.statistics.totalHomePossession)+parseInt(a.statistics.totalAwayPossession), parseInt(b.statistics.totalHomePossession)+parseInt(b.statistics.totalAwayPossession), isAsc);
        case 'bell':
          return compare(a.bell, b.bell, isAsc);
        default:
          return 0;
      }
    });
  }
}


function compare(a: number, b: number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
