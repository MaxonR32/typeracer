import { createFeatureSelector, createSelector } from '@ngrx/store'

import { OnlineState } from '../reducers/online.reducer'

export const selectTextState = createFeatureSelector<OnlineState>('online')

export const selectOnline = createSelector(
  selectTextState,
  (state: OnlineState) => state
)


