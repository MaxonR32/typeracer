import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { GetText, Word, User } from '../../interface';
import { TextService } from './text.service';

@Injectable({providedIn: 'root'})
export class OnlineService {   

  data: any
  users: any
  arrayUsers: User[] 

	constructor(
		private db: AngularFireDatabase,
   	private route: Router,
    private firestore: AngularFirestore,
		private textService: TextService
	) {}
	// get text for online room by room name
	getTextOnline({roomName}) {
		return this.db.object(`rooms/${roomName}/text`).valueChanges().pipe(map(text => {
			let gettedText
			if(!text) {
				return Observable.create(observer => observer.next())
			}
			gettedText = text as string
			console.log(gettedText)
			return this.textService.convertText(gettedText.split(' '))
		}))	
	}

	getBlockRoomChange({roomName}): Observable<boolean> {
		return this.db.object(`rooms/${roomName}/block`).valueChanges().pipe(map(value => {
			// console.log(value)
			let valueOfBlock = value as boolean 
			return valueOfBlock
		}))
	}

	// create text when create room
	getTextFromFirestore(nameRoom, randomNumber): Observable<string> {		
		return this.firestore.collection('text').valueChanges().pipe(map(objectText => {
			// get text
			let t = objectText[0] as GetText
      let allText = t.textForWrite
      let text = allText.split(' ')
      let str
      
      // when create new room
		  str = text.slice(randomNumber, randomNumber + 60)
		  return str.join(' ')

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
				ready: false
			}
		})				
	}

	getItem(key: string) {
		const roomsRef = this.db.object(`rooms/${key}`)
		return roomsRef.valueChanges()
	}
	// create room
	createRoom({roomData}) {
		return this.getTextFromFirestore(roomData.nameRoom, roomData.randomNumber).pipe(map((text) => {
		this.db.object(`rooms/${roomData.roomName}`).update({
		 	block: false, 
		 	text,
			name: roomData.roomName,
		})
		this.db.object(`rooms/${roomData.roomName}/user`).update({
			[roomData.userName]: {
					userName: roomData.userName,
					ready: false,
					distance: 0
				}
			})
		}))
		
	}


	experiment() {
		return this.db.object('rooms').valueChanges().pipe(map(object => {
			let num: any = object
			return num
		}))
	}

	changeUserDistance({distance, userName, roomName}) {
		this.db.object(`rooms/${roomName}/user/${userName}`).update({
			distance,
		})
	}

	deleteRoom(roomName) {
		console.log('someDataa')
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

}