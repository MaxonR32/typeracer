import { createReducer, on, Action } from '@ngrx/store'
import { OnlineActions } from '../actions'

export interface OnlineState  {
	online: boolean
	roomName: string
	userName: string
	ready: boolean,
	block: boolean
}

export const initialState: OnlineState = {
	online: false,
	roomName: '',
	userName: '',
	ready: false,
	block: false
}

export const onlineReducerCreaete = createReducer(
	initialState,
	on(OnlineActions.changeOnlineToTrue, (state, {onlineData}) => ({
		...state,
		online: true,
		roomName: onlineData.roomName,
		userName: onlineData.userName
	})),
	on(OnlineActions.changeOnlineToFalse, state => ({
		...state,
		online: false,
		roomName: '',
		userName: ''
	 })),
	on(OnlineActions.changeReadyStateSuccess, (state, {ready}) => ({
		...state,
		ready: ready
	})),
	on(OnlineActions.blockRoomChangeSuccess, (state, {block}) => ({
		...state,
		block
	}))
)

export function onlineReducer(state: OnlineState | undefined, action: Action) {
	return onlineReducerCreaete(state, action)
}