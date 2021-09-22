import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GuardState } from '../reducers/guard.reducers';

export const selectGuardState = createFeatureSelector<GuardState>('guard')

export const selectGuard = createSelector(
	selectGuardState,
	(state) => state 	
)