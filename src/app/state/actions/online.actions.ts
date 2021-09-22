import { createAction, props } from '@ngrx/store'
import { Online, Word, User } from '../../interface'

export const changeOnlineToTrue = createAction(
	'[Online] True',
	props<{onlineData: Online}>()
)

export const changeOnlineToFalse = createAction(
	'[Online] False'
)

export const createRoom = createAction(
	'[Online] Create Room',
	props<{roomData: {roomName: string, userName: string, randomNumber: number}}>()
)
export const createRoomSuccess = createAction(
	'[Online] Create Room Success'
)

export const joinRoom = createAction(
	'[Online] Join Room',
	props<{joinData: {roomName: string, userName: string}}>()
)

export const joinRoomSuccess = createAction(
	'[Online] Join Room Success'
)

export const getTextOnline = createAction(
	'[Online] Get Text',
	props<{roomName: string}>()
)

export const getTextOnlineSuccess = createAction(
	'[Online] Get Text Success',
	props<{words: Word[]}>()
)

export const getTextOnlineSuccessNull = createAction(
	'[Online] Get Text Success Null',
)	


export const getUsers = createAction(
	'[Online User] Get Users',
	props<{roomName: string}>()
)

export const getUsersSuccess = createAction(
	'[Online User] Get Users Success',
	props<{users: User[]}>()
)

export const changeUserDistance = createAction(
	'[Online] Change User Distance',
	props<{distanceData: {distance: number, userName: string}}>()
)

export const changeUserDistanceSuccess = createAction(
	'[Online] Change User Distance Success'
)	

export const deleteUser = createAction(
	'[Online] Delete Users'
)

export const changeReadyState = createAction(
	'[Online] Change Ready',
	props<{readyData: {userName: string, roomName: string, ready: boolean}}>()
)

export const changeReadyStateSuccess = createAction(
	'[Online] Change Ready Success',
	props<{ready: boolean}>()
)

export const blockRoomChange = createAction(
	'[Online] Block Room',
	props<{roomName: string}>()
)

export const blockRoomChangeSuccess = createAction(
	'[Online] Block Room Success',
	props<{block: boolean}>()
)