import { createAction, props } from '@ngrx/store'

export const getRandomNumbers = createAction(
	'[Online] Get Random Numbers',
	props<{roomName: string}>()
)

export const getRandomNumbersSuccess = createAction(
	'[Online] Get Random Numbers Success',
	props<{randomNumbers: number[]}>()
)

export const deleteRandomNumbers = createAction(
	'[Online] Delete Numbers'
)