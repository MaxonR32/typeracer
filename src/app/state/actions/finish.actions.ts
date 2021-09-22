import { createAction } from '@ngrx/store'

export const finishTrue = createAction(
	'[Finish] True'
)

export const finishFalse = createAction(
	'[Finish] False'
)