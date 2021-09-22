import { createAction, props } from '@ngrx/store'
import { Letter, LetterForCheck, Word } from '../../interface';
import { Update } from '@ngrx/entity';

export const addText = createAction(
	'[Text] Add Text'
)

export const addTextSuccess = createAction(
	'[Text] Add Text Succes',
	props<{words: Word[]}>()
)

export const checkLetter = createAction(
	'[Text] Check Text',
	props<{letterForCheck: {wordId: number, letterId: number, value: string}, gettedWord: Word}>()
)

export const sendResult = createAction(
	'[Text] Send Result',
	props<{word: Update<Word>}>()
)

export const clickBackspace = createAction(
	'[Text] Click Backspace',
	props<{position: number, gettedWord: Word, wordId: number, lengthInput: number}>()
)

export const changeCursorCoordinates  = createAction(
	'[Cursor] Change Cursor',
	props<{startCursor: number, endCursor: number, gettedWord: Word}>()
)

export const changeCursorSuccess  = createAction(
	'[Cursor] Change Cursor Success',
	props<{word: Update<Word>}>()
)

export const clearTextOnDestroy = createAction(
	'[Text] Clear Text'
)