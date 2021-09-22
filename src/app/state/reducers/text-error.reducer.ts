import { createReducer, on, Action } from '@ngrx/store'
import { TextErrorActions } from '../actions'

export interface TextErrorState {
	id: number | null
}

export const initialState: TextErrorState = {
	id: null
}

export const textErrorReducerCreaete = createReducer(
	initialState,
	on(TextErrorActions.changeErrorToTrue, (state, {id}) => ({
		id
	})),
	on(TextErrorActions.changeErrorToFalse, (state, {id}) => ({
		id: null
	})),
)

export function textErrorReducer(state: TextErrorState | undefined, action: Action) {
	return textErrorReducerCreaete(state, action)
}