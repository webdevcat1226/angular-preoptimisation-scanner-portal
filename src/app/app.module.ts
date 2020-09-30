import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { EventsComponent } from './pages/events/events.component';
import { HeaderComponent } from './header/header.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http'
import {ChartsModule} from 'ng2-charts';
import { MomentumGraphComponent } from './momentum-graph/momentum-graph.component';
import { MomentumSplineChartComponent } from './momentum-spline-chart/momentum-spline-chart.component';
import { FormsModule } from '@angular/forms';
import {AveragePipeModule} from './pipes/average.pipe';
import {SumPipeModule} from './pipes/sum.pipe';
import {SearchPipeModule} from './pipes/search-filter.pipe';
import { CurrentFormComponent } from './current-form/current-form.component';
import { HistoricalStatsPopOverComponent } from './historical-stats-pop-over/historical-stats-pop-over.component';
import { ScoreGridComponent } from './home/score-grid/score-grid.component';
import { CurrentFormGridComponent } from './current-form-grid/current-form-grid.component';
import { QuickFilterPopupComponent } from './quick-filter-popup/quick-filter-popup.component';
import { StatsFilterPopupComponent } from './stats-filter-popup/stats-filter-popup.component';
import { SettingsPopupComponent } from './settings-popup/settings-popup.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatSortModule} from '@angular/material/sort';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { StrategyPopupComponent } from './strategy-popup/strategy-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MatchesComponent,
    TeamsComponent,
    EventsComponent,
    HeaderComponent,
    MomentumGraphComponent,
    MomentumSplineChartComponent,
    CurrentFormComponent,
    HistoricalStatsPopOverComponent,
    ScoreGridComponent,
    CurrentFormGridComponent,
    QuickFilterPopupComponent,
    StatsFilterPopupComponent,
    SettingsPopupComponent,
    StrategyPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    ChartsModule,
    NgbModule,
    ColorPickerModule,
    FormsModule,
    AveragePipeModule,
    SumPipeModule,
    SearchPipeModule,
    MatSortModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
