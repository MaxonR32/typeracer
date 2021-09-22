import { createFeatureSelector, createSelector } from '@ngrx/store'
import { TextState, selectAll } from './text.reducer'
import { TextErrorState } from './text-error.reducer';

export const productsModuleFeatureKey = 'productsModule'



export interface AppState {
  text: TextState
}

export const selectTextErrorState = createFeatureSelector<TextErrorState>('textError')

export const selectTextError = createSelector(
  selectTextErrorState,
  (state) => state.id
)
