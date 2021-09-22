import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InputState } from '../reducers/input.reducer';

export const selectInputState = createFeatureSelector<InputState>('input')

export const selectInput = createSelector(
	selectInputState,
	(state) => state 	
)