import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { GetText, Word, User } from '../../interface';
import { TextService } from './text.service';

import { TextActions } from '../../state/actions';


@Injectable({providedIn: 'root'})
export class OnlineService {   

  data: any
  users: any
  arrayUsers: User[] 

  readonly onDestroyBeforeRace = new Subject<void>()

	constructor(
		private db: AngularFireDatabase,
   	private route: Router,
    private firestore: AngularFirestore,
		private textService: TextService,
    private store: Store

	) {}
	
	// get text for online room by room name
	getTextOnline({roomName}) {
		return this.db.object(`rooms/${roomName}/text`).valueChanges().pipe(map(text => {
			
			let gettedText
			if(!text) {
				return Observable.create(observer => observer.next())
			}
			gettedText = text as string
			return this.textService.convertText(gettedText.split(' '))
		}))	
	}

	// create text when create room
	getTextFromFirestore(randomNumber): Observable<string> {			
		return this.firestore.collection('text').valueChanges().pipe(map(objectText => {
			// console.log('some')
			// get text
			let t = objectText[0] as GetText
      let allText = t.textForWrite
      let text = allText.split(' ')
      
      
      // when create new room
		  let str = text.slice(randomNumber, randomNumber + 10)
		  return str.join(' ')
		}))
	}

	getBlockRoomChange({roomName}): Observable<boolean> {
		return this.db.object(`rooms/${roomName}/block`).valueChanges().pipe(map(value => {
			let valueOfBlock = value as boolean 
			return valueOfBlock
		}))
	}

	// get users for online room
	getUsers({roomName}) {
		return this.db.object(`rooms/${roomName}/user`).valueChanges().pipe(map(data => {
			let arrayUsers: User[] = []
			let users = data as User
			for(let user in users) {
				arrayUsers.push(users[user])
			}
			if(arrayUsers.length === 0) {
				this.deleteRoom(roomName)
			}
			return arrayUsers
		}))
	}

	searchRoom(roomName) {
		return this.db.object(`rooms/${roomName}`).valueChanges()
				
	}
	// join in room when room are created by other user
	joinRoom(userName, roomName) {
		this.db.object(`rooms/${roomName}/user`).update({
			[userName]: {
				userName,
				distance: 0,
				ready: false,
				finish: false,
				changeText: false
			}
		})				
	}

	// create room
	createRoom({roomData}) {
		return this.getTextFromFirestore(roomData.randomNumber).pipe(map(text => {
			this.db.object(`rooms/${roomData.roomName}`).update({
			 	block: false, 
			 	text,
			 	randomNumbers: roomData.randomNumbers,
				name: roomData.roomName,
				lapText: 0 
			})
			this.db.object(`rooms/${roomData.roomName}/user`).update({
				[roomData.userName]: {
						userName: roomData.userName,
						ready: false,
						changeText: false,
						finish: false,
						distance: 0
					}
				})
		}))
	}

	getLapText({roomName}) {
		return this.db.object(`rooms/${roomName}/lapText`).valueChanges().pipe(map(data => {
			return data as number
		}))
	}

	getRandomNumbers({roomName}) {
		return this.db.object(`rooms/${roomName}/randomNumbers`).valueChanges().pipe(map(data => {
			return data as number[]
		}))
	}

	newText({roomName, randomNumber, lapText}) {
		console.log(roomName, randomNumber, lapText)
		return this.getTextFromFirestore(randomNumber).pipe(map(text => {
			// console.log(text)
			this.store.dispatch(TextActions.clearTextOnDestroy())
			this.db.object(`rooms/${roomName}`).update({
				text,
				lapText
			})
		}))
	}

	changeUserDistance({distance, userName, roomName}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			distance,
		})
	}

	deleteRoom(roomName) {
		this.db.object(`rooms/${roomName}`).remove()
	}

	deleteUser({roomName, userName}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).remove()
	}

	changeReadyState({roomName, userName, ready}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			ready
		})
	}

	changeFinishState({userName, roomName, finish}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			finish
		})
	}

	saveWpm({userName, roomName, wpm}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			wpm
		})
	}

	blockRoom({roomName, block}) {
		this.db.object(`rooms/${roomName}`).update({
			block
		})		
	}

	resetData({roomName, userName, distance, wpm}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			wpm,
			distance
		})	
	}

	blockRoomChange({roomName, block}) {
		this.db.object(`rooms/${roomName}`).update({
			block
		})
	}

	chageNewTextState({roomName, userName, changeText}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			changeText
		})
	}

	// changeLapText({roomName, lapText}) {
	// 	this.db.object(`rooms/${roomName}`).update({
	// 		lapText
	// 	})		
	// }
}