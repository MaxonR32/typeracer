import { createAction, props } from '@ngrx/store'

export const wirtennText = createAction(
	'[Input Text] Input Text',
	props<{typedValue: string}>()
)