import { createReducer, on, Action } from '@ngrx/store'
import { FinishActions } from '../actions'

export interface FinishState {
	finish: boolean
}

export const initialState: FinishState = {
	finish: false
}

export const finishReducerCreaete = createReducer(
	initialState,
	on(FinishActions.finishTrue, (state) => ({
		finish: true
	})),
	on(FinishActions.finishFalse, (state) => ({
		finish: false
	})),
)

export function finishReducer(state: FinishState | undefined, action: Action) {
	return finishReducerCreaete(state, action)
}