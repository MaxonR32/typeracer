import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module'
// routing
import { AppRoutingModule } from './app-routing.module';

// Ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { HomeComponent } from './components/home/home.component';
import { RaceActivitiesComponent } from './components/race-activities/race-activities.component';
import { TextForWriteComponent } from './components/race-activities/text-for-write/text-for-write.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { EntranceInRoomComponent } from './components/entrance-in-room/entrance-in-room.component'

// FireBase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// State 
// Reducer
import { reducer } from './state/reducers/input.reducer'
import { textReducer } from './state/reducers/text.reducer'
import { textErrorReducer } from './state/reducers/text-error.reducer';
import { onlineReducer } from './state/reducers/online.reducer';
import { usersReducer } from './state/reducers/users.reducer'
import { finishReducer } from './state/reducers/finish.reducers'
import { guardReducer } from './state/reducers/guard.reducers'
// Effects
import { TextEffects } from './state/effects/text.effects'
import { OnlineEffects } from './state/effects/online.effects';
import { StartComponent } from './dynamic-components/start/start.component';
import { CountdownComponent } from './components/race-activities/countdown/countdown.component';
import { ShowResultComponent } from './components/race-activities/show-result/show-result.component'

import { PageGuard } from './shared/guards/race.guards'

import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    HomeComponent,
    RaceActivitiesComponent,
    TextForWriteComponent,
    CreateRoomComponent,
    EntranceInRoomComponent,
    StartComponent,
    CountdownComponent,
    ShowResultComponent,
  ],
  imports: [
    MaterialModule,
    ClipboardModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'mytestapp'),
    AngularFireDatabaseModule,
    StoreModule.forRoot({
      input: reducer,
      text: textReducer,
      textError: textErrorReducer,
      online: onlineReducer,
      users: usersReducer,
      finish: finishReducer,
      guard: guardReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([
      TextEffects,
      OnlineEffects
      ])
  ],
  providers: [PageGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
