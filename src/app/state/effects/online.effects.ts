import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { TextService } from '../../shared/services/text.service'
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators'
import { TextActions, OnlineActions } from '../actions'
import { Online,Word, User } from '../../interface'
import { Update } from '@ngrx/entity';
import { OnlineService } from '../../shared/services/online.serivce';

@Injectable()
export class OnlineEffects {
	constructor(
		private actions$: Actions,
		private onlineService: OnlineService
	) {}
	// get text online
	textOnline$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(OnlineActions.getTextOnline),
			switchMap((roomName) => {
				return this.onlineService.getTextOnline(roomName)
				.pipe(
					map((words: Word[]) => {
						if(words.length) {
							return OnlineActions.getTextOnlineSuccess({words})
						} else {
							return OnlineActions.getTextOnlineSuccessNull()
						}
					})
				)	

			})
		)
	})
	// when create room
	createRoom$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(OnlineActions.createRoom),
			switchMap((roomData) => {
				return this.onlineService.createRoom(roomData)
				.pipe(
					map(() => OnlineActions.createRoomSuccess())
				)
			})
		)
	})
	// get users
	getUsers$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(OnlineActions.getUsers),
			switchMap((roomName) => {
				return this.onlineService.getUsers(roomName)
				.pipe(
					map((users: User[]) => OnlineActions.getUsersSuccess({users}))
				)
			})
		)
	})	
	// blockRoom
	blockRoom$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(OnlineActions.blockRoomChange),
			switchMap((roomName) => {
				return this.onlineService.getBlockRoomChange(roomName)
				.pipe(
					map((block: boolean) => OnlineActions.blockRoomChangeSuccess({block}))
				)
			})
		)
	})
}