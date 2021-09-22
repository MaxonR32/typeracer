import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// components
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component'
import { HomeComponent } from './components/home/home.component'
import { RaceActivitiesComponent } from './components/race-activities/race-activities.component'
import { CreateRoomComponent } from './components/create-room/create-room.component'
import { EntranceInRoomComponent } from './components/entrance-in-room/entrance-in-room.component'

import { PageGuard } from './shared/guards/race.guards'

const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'race', component: RaceActivitiesComponent, canActivate: [PageGuard]},
      {path: 'roomnew', component: CreateRoomComponent, canActivate: [PageGuard]},
      {path: 'entrace', component: EntranceInRoomComponent, canActivate: [PageGuard]}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
