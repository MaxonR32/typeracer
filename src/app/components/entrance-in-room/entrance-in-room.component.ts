import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnlineService } from '../../shared/services/online.serivce';
import { Store } from '@ngrx/store';

import { OnlineActions } from '../../state/actions'
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MaterialServices } from '../../shared/services/material.services';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-entrance-in-room',
  templateUrl: './entrance-in-room.component.html',
  styleUrls: ['./entrance-in-room.component.scss']
})
export class EntranceInRoomComponent implements OnInit {
  
  form: FormGroup
  nameUser: string
  uuidNameUser: string
  
  readonly onDestroy = new Subject<void>()

  constructor(
    private onlineService: OnlineService,
    private route: Router,
    private store: Store,
    private material: MaterialServices
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      roomName: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(20)]),
      userName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
    });
    this.uuidNameUser = uuidv4().slice(0, 10)

  }

  get roomNames(): string {
    return this.form.value.roomName
  }

  get rooomNameInput() {
    return this.form.get('roomName') as FormControl
  }

  get userNameInput() {
    return this.form.get('userName') as FormControl
  }

  get userName(): string {
    return this.form.value.userName
  }

  createUserName(): string {
    return this.nameUser = this.userName + this.uuidNameUser
  }

  joinRoom() {
    this.onlineService.searchRoom(this.roomNames).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if(data) {
        this.onDestroy.next()
        this.onlineService.joinRoom(this.createUserName(), this.roomNames)
        this.store.dispatch(OnlineActions.changeOnlineToTrue({onlineData: {online: true, roomName: this.roomNames, userName: this.createUserName()}}))
        this.store.dispatch(OnlineActions.joinRoom({joinData: {roomName: this.roomNames, userName: this.createUserName()}}))
        this.route.navigate(['/race'])       
      }
      else {
        this.material.openSnackbar('room not found')
      }
    })  
  }
    
}

