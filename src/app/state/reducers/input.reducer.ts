import { createReducer, on, Action } from '@ngrx/store'
import { InputActions } from '../actions'

export interface InputState {
	typedValue: string
	length: number
}

const initialState: InputState = {
	typedValue: '',
	length: 0
}

export const inputReducer = createReducer(
	initialState,
	on(InputActions.wirtennText, (state, {typedValue}) => ({
		typedValue,
		length: typedValue?.length
	}))
)

export function reducer(state: InputState | undefined, action: Action) {
	return inputReducer(state, action)
}