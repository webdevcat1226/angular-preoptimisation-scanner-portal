import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { EventsComponent } from './pages/events/events.component';
import { CurrentFormComponent } from './current-form/current-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'form/:homeId/:type', component: CurrentFormComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'events', component: EventsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
