import { createReducer, on, Action } from '@ngrx/store'
import { OnlineActions, RandomNumbersActoins } from '../actions'

export interface OnlineState  {
	online: boolean
	roomName: string
	userName: string
	ready: boolean
	block: boolean
	lapText: number
	randomNumbers: number[]
}

export const initialState: OnlineState = {
	online: false,
	roomName: '',
	userName: '',
	ready: false,
	block: false,
	lapText: 0, 
	randomNumbers: []
}

export const onlineReducerCreaete = createReducer(
	initialState,
	on(OnlineActions.changeOnlineToTrue, (state, {onlineData}) => ({
		...state,
		online: true,
		roomName: onlineData.roomName,
		userName: onlineData.userName,
	})),
	on(OnlineActions.changeOnlineToFalse, state => ({
		...state,
		online: false,
		roomName: '',
		userName: '',
		randomNumbers: [],
		lapText: 0
	 })),
	on(OnlineActions.changeReadyStateSuccess, (state, {ready}) => ({
		...state,
		ready
	})),
	on(OnlineActions.blockRoomChangeSuccess, (state, {block}) => ({
		...state,
		block
	})),
	on(OnlineActions.getRandomNumbersSuccess, (state, {randomNumbers}) => ({
		...state,
		randomNumbers
	})),
	on(OnlineActions.changeLapTextSuccess, (state, {lapText}) => ({
		...state,
		lapText
	}))
)

export function onlineReducer(state: OnlineState | undefined, action: Action) {
	return onlineReducerCreaete(state, action)
}