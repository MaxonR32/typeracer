import { createReducer, on, Action } from '@ngrx/store'
import { OnlineActions } from '../actions'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Word, Letter, User } from '../../interface'

export interface UsersState {
	users: User[]
}

const initialState: UsersState = {
	users: []
}

export const createReuducerUsers = createReducer(
	initialState,
	on(OnlineActions.getUsersSuccess, (state, {users}) => ({
		users
	})),
	on(OnlineActions.deleteUser, (state) => ({
		users: [],
	}))
)


export function usersReducer(state: UsersState | undefined, action: Action) {
	return createReuducerUsers(state, action)
}
