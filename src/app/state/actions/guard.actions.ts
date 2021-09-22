import { createAction } from '@ngrx/store';

export const changeGuardTrue = createAction(
	'[Guard] True'
)

export const changeGuardFalse = createAction(
	'[Guard] False'
)