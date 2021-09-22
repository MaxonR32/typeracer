import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { delay, map, takeUntil } from 'rxjs/operators';
import { HostListener } from '@angular/core';

import { Letter, User } from '../../interface'

import { TextService } from '../../shared/services/text.service'
import { MaterialServices } from '../../shared/services/material.services'
import { OnlineService } from '../../shared/services/online.serivce';
// Ngrx
import { OnlineActions, TextActions, FinishActions, GuardActions } from '../../state/actions';
import { TextState } from '../../state/reducers/text.reducer';

import * as fromText from '../../state/selectors/text.selectors'
import * as fromUsers from '../../state/selectors/user.selector'
import * as fromOnlineSelector from '../../state/selectors/online.selector'
import * as fromFinish from '../../state/selectors/finish.selectors'

import { TextForWriteComponent } from './text-for-write/text-for-write.component';
import { CountdownComponent } from './countdown/countdown.component'
import { ShowResultComponent } from './show-result/show-result.component';

import { ClipboardService } from 'ngx-clipboard';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-race-activities',
  templateUrl: './race-activities.component.html',
  styleUrls: ['./race-activities.component.scss']
})
export class RaceActivitiesComponent implements OnInit, OnDestroy, AfterViewInit {
   
  counter: number = 4
  result: number = 0
  typedEntrie: number = 0

  val: number = 0
  text$: Observable<any>  
  finish$: Observable<{finish: boolean}>
  users = []
  users$: Observable<User[]>
  exp: Observable<any>

  online: boolean
  createRoomState: boolean
  userName: string
  randomNumber: number 
  roomName: string
  allReady: boolean = false
  blockRoom: boolean
  userDistance: number = 0

  windowResize: number = 1

  countWord: number = 0
  seconds: number = 0
  interval: any
  disabledInput: boolean = false
  
  subscribeToUserReadyState: Subscription
  subscribeToTextOnline: Subscription
  subscribeToDeleteUser: Subscription
  subscribeToFinish: Subscription

  blockBtnReady: boolean = true
  blockBtnReset: boolean = true

  readonly onDestroyBeforeRace = new Subject<void>()
  readonly onDestroyAfterCheck = new Subject<void>()

  @ViewChild(TextForWriteComponent) textForWriteComponent: TextForWriteComponent
  @ViewChild(CountdownComponent) countdownComponent: CountdownComponent

  constructor(
    private textService: TextService,
    private store: Store<TextState>,
    private router: Router,
    private onlineService: OnlineService,
    private el: ElementRef,
    private materialService: MaterialServices,
    private dialog: MatDialog,
    private clipboardApi: ClipboardService,
    private ref: ChangeDetectorRef,
    private scroller: ViewportScroller
  ) {
    // this.blockRoom$ = this.store.pipe(s)
    this.text$ = this.store.pipe(select(fromText.selectText))
    this.finish$ = this.store.pipe(select(fromFinish.selectFinisht))
    this.randomNumber = Math.floor(Math.random() * 1250)
 
    this.store.pipe(select(fromOnlineSelector.selectOnline)).subscribe(data => {
      this.online = data.online
      this.roomName = data.roomName
      this.userName = data.userName
      this.blockRoom = data.block
      console.log(this.userName)
    })
  }

  ngOnInit() {
    this.store.dispatch(OnlineActions.blockRoomChange({roomName: this.roomName}))
    this.subscribeFinish()
   
   // online join in room
    if(this.online) {
      this.users$ = this.store.pipe(select(fromUsers.selectUsers))

      this.forStartRaceOnline()
    }
    // correct the window Size
    if(window.innerWidth <= 400) {
      this.windowResize = 2.7
    } else if(window.innerWidth <= 700) {
      this.windowResize = 1.8
    } else {
      this.windowResize = 1
    } 
  
  }

  ngAfterViewInit() {
    if(!this.online) {
      this.forStartRaceOffline()
      
    }
  }

  ngOnDestroy(): void {
    if(this.online) {
      this.subscribeToDeleteUser = this.users$.subscribe(users => {
        if(users.length === 1) {
          this.onlineService.deleteRoom(this.roomName)

        } else if(users.length > 1) {
          // delete user from db 
          this.onlineService.deleteUser({roomName: this.roomName, userName: this.userName})
        }
          // delete users from ngrx 
          this.store.dispatch(OnlineActions.deleteUser())
          // false online
          this.store.dispatch(OnlineActions.changeOnlineToFalse())
          // clear text from ngrx
          this.store.dispatch(TextActions.clearTextOnDestroy())
          // go to home
          this.router.navigate(['home'])
          this.store.dispatch(FinishActions.finishFalse())
          this.store.dispatch(GuardActions.changeGuardFalse())  
          this.subscribeToDeleteUser.unsubscribe()
        
      })
    } else {
        this.store.dispatch(OnlineActions.changeOnlineToFalse())
        this.store.dispatch(TextActions.clearTextOnDestroy())
        this.router.navigate(['home'])
        this.store.dispatch(FinishActions.finishFalse())
        this.store.dispatch(GuardActions.changeGuardFalse())
    }
    
  }

  // when close window
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    this.subscribeToDeleteUser = this.users$.subscribe(users => {
      // when user is last delete room
      if(users.length === 1) {
        this.onlineService.deleteRoom(this.roomName)
        this.subscribeToDeleteUser.unsubscribe()

      } 
      // delete one user
      else if(users.length > 1) {
        this.onlineService.deleteUser({roomName: this.roomName, userName: this.userName})
        this.subscribeToDeleteUser.unsubscribe()

      }
    })
    // $event.returnValue = 'some'
  }

  @HostListener('window:resize')
  resizeWindow() {
    if(window.innerWidth <= 400) {
      this.windowResize = 2.7
    } else if(window.innerWidth <= 700) {
      this.windowResize = 1.8
    } else {
      this.windowResize = 1
    }
  }

  subscribeFinish() {
     this.subscribeToFinish = this.finish$.subscribe(data => {

      if(data.finish === true) {
        this.subscribeToFinish.unsubscribe()
   
        this.blockBtnReset = false
        // open modal with result
        this.showResult()
        // stop countDown
        this.countdownComponent.stopCountdown()
        this.textForWriteComponent.disableFormMethod()
      }
    })
  }

  forStartRaceOnline() {
    this.store.dispatch(OnlineActions.getTextOnline({roomName: this.roomName}))
    this.store.dispatch(OnlineActions.getUsers({roomName: this.roomName}))
    this.users$.pipe(takeUntil(this.onDestroyAfterCheck)).subscribe(users => {
      
      if(users.length > 6) { // max is 7
        this.onDestroyAfterCheck.next()
        this.ngOnDestroy()
        this.router.navigate(['/home'])

      } else if(users.length > 0) {
        this.blockBtnReady = false

        this.onDestroyAfterCheck.next()
        this.afterCheckUsersLength()

      }
    })
  }

  afterCheckUsersLength() {
    this.users$.pipe(takeUntil(this.onDestroyBeforeRace)).subscribe(users => {
      if(users.length) {
        this.allReady = users.every(user => user.ready === true)
      }
      if(this.allReady === true) {
        // beacuse subscribe called more time and this interfere work of interval
        clearInterval(this.interval)
        this.start()
      }
    }) 
  }

  forStartRaceOffline() {
    this.store.dispatch(TextActions.addText())
    this.start()
  }

  outputSeconds(event) {
    // if time is down
    this.seconds += 1
    if(event === 50) {
      this.store.dispatch(FinishActions.finishTrue())
    }
  }

  showResult() {
    this.countWord = this.textService.getResult(this.typedEntrie, this.seconds)
    
    if(this.online) {
      this.onlineService.blockRoom({roomName: this.roomName, block: false})
      this.onlineService.changeReadyState({userName: this.userName, roomName: this.roomName, ready: false})   
      this.onlineService.saveWpm({userName: this.userName, roomName: this.roomName, wpm: this.countWord})
    }
   
    const dialogRef = this.dialog.open(ShowResultComponent, this.materialService.opneModalResult(this.countWord, this.online))
  }

  reset() {
    this.blockBtnReady = false
    this.blockBtnReset = true
    this.store.dispatch(FinishActions.finishFalse())

    this.textForWriteComponent.onRestart()
    this.countdownComponent.restartCountdown()

    
    // if online
    if(this.online) {

      this.onlineService.resetData({distance: 0, roomName: this.roomName, userName: this.userName, wpm: 0})
      this.store.dispatch(TextActions.clearTextOnDestroy())

      this.forStartRaceOnline()
      this.subscribeFinish()
    } 
    // if offline 
    else {
      this.store.dispatch(TextActions.clearTextOnDestroy())
      this.forStartRaceOffline()
    }
  }

  changeUserDistance(event) {
    this.userDistance = event.distance
    this.typedEntrie = event.typedEntrie
    if(this.online) {
      this.onlineService.changeUserDistance({distance: event.distance, roomName: this.roomName, userName: this.userName})
    }
  }

  start() {  
   if(this.online) {
      this.onlineService.blockRoomChange({roomName: this.roomName, block: true})
   } 

    this.typedEntrie = 0 
    this.onDestroyBeforeRace.next()
    this.seconds = 0
    this.textForWriteComponent.disableFormMethod()
    this.countdownComponent.stopCountdown()
    this.counter = 4
    this.interval = setInterval(() => {
      if(this.counter == 1) {
        this.textForWriteComponent.enableFormMethod()
        this.countdownComponent.startCountdown()
      } else if(this.counter == 0.5) {
        clearInterval(this.interval)
      }
      this.counter -= 0.5
    }, 500)  
  }

  setStyleUserDistance(distance) {
    let styles = {
      'padding-left': distance / this.windowResize + 'px',
    }
    return styles
  }

  ready() {
    console.log(this.userName)
    this.blockBtnReady = true
    this.onlineService.changeReadyState({userName: this.userName, roomName: this.roomName, ready: true})
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.roomName)
    this.materialService.openSnackbar('key has been copied')
  }

  clc() {
    this.scroller.scrollToPosition([0, 110])
  }
}