import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FinishState } from '../reducers/finish.reducers';

export const selectFinishtState = createFeatureSelector<FinishState>('finish')

export const selectFinisht = createSelector(
	selectFinishtState,
	(state) => state 	
)