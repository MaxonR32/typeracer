import { TextState, selectAll } from '../reducers/text.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectTextState = createFeatureSelector<TextState>('text')


export const selectText = createSelector(
  selectTextState,
  selectAll
)

export const selectOneLetter = createSelector(
  selectTextState,
  (entities, {id}) => {
    return entities.entities[id]
  }
)

export const selectMoreLetter = createSelector(
  selectTextState,
  (entities, {arr}) => {
    let result = arr.map(id => {
      return entities.entities[id]
    })
    return result
  }
)

