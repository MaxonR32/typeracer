import { createAction, props } from '@ngrx/store'

export const changeErrorToTrue = createAction(
	'[Text Error] True',
	props<{id: number}>()
)

export const changeErrorToFalse = createAction(
	'[Text Error] False',
		props<{id: number | null}>()

)