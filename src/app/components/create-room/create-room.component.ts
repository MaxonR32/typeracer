import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnlineActions } from '../../state/actions'
import { v4 as uuidv4 } from 'uuid';
import { ClipboardService } from 'ngx-clipboard';

import { MaterialServices } from '../../shared/services/material.services'
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  isOpen = 'open'
  form: FormGroup;
  randomNumber: number
  nameRoom: string
  nameUser: string
  uuidNameUser: string

  arrRandomNumber: number[] = []
  
  constructor(
    private store: Store,
    private route: Router,
    private clipboardApi: ClipboardService,
    private material: MaterialServices
  ) {
    this.randomNumber = Math.floor(Math.random() * 1250)
    this.uuidNameUser = uuidv4().slice(0, 10)
  }

  ngOnInit(): void {
    this.nameRoom = uuidv4().slice(0, 20)
    this.form = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
    });
  }

  get roomName(): string {
    return this.nameRoom
  }

  get userName(): string {
    return this.form.value.userName
  }

  get userNameInput() {
    return this.form.get('userName') as FormControl
  }

  createRoom() {
    for(let i = 0; i < 20; i++) {
      let random = Math.floor(Math.random() * 1250)
      this.arrRandomNumber.push(random)
    }
    this.store.dispatch(OnlineActions.createRoom({roomData: {roomName: this.roomName, userName: this.createUserName(), randomNumber: this.randomNumber, randomNumbers: this.arrRandomNumber}}))
    this.store.dispatch(OnlineActions.changeOnlineToTrue({onlineData: {online: true, roomName: this.roomName, userName: this.createUserName()}}))
    this.route.navigate(['/race'])
  }

  generateNewName() {
    this.nameRoom = uuidv4().slice(0, 20)
  }

  createUserName(): string {
    return this.nameUser = this.userName + this.uuidNameUser
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.nameRoom)
    this.material.openSnackbar('key has been copied')
  }
}