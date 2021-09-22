import { createReducer, on, Action } from '@ngrx/store'
import { GuardActions } from '../actions'

export interface GuardState  {
	guard: boolean
}

export const initialState: GuardState = {
	guard: false
}

export const guardReducerCreaete = createReducer(
	initialState,
	on(GuardActions.changeGuardTrue, () => ({
		guard: true
	})),
	on(GuardActions.changeGuardFalse, () => ({
		guard: false
	 }))
)

export function guardReducer(state: GuardState | undefined, action: Action) {
	return guardReducerCreaete(state, action)
}