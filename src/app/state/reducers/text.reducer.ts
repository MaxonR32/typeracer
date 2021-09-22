import { createReducer, on, Action } from '@ngrx/store'
import { TextActions, OnlineActions } from '../actions'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Word, Letter } from '../../interface'

export interface TextState extends EntityState<Word> {

}

export const adapter: EntityAdapter<Word> = createEntityAdapter<Word>()

export const initialState: TextState = adapter.getInitialState({})


export const createReuducerText = createReducer(
	initialState,
	on(TextActions.addTextSuccess, (state, { words }) => adapter.addMany(words, state)),
	on(TextActions.sendResult, (state, { word }) => adapter.updateOne(word, state)),
	on(TextActions.changeCursorSuccess, (state, { word }) => adapter.updateOne(word, state)),
	on(OnlineActions.getTextOnlineSuccess, (state, { words }) => adapter.addMany(words, state)),
	on(TextActions.clearTextOnDestroy, state => adapter.removeAll({...state}))
)


export function textReducer(state: TextState | undefined, action: Action) {
	return createReuducerText(state, action)
}

export const { selectAll } = adapter.getSelectors()