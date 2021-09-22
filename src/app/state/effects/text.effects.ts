import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { TextService } from '../../shared/services/text.service'
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators'
import { TextActions, OnlineActions } from '../actions'
import { Letter, Online, Word } from '../../interface'
import { Update } from '@ngrx/entity';
import { OnlineService } from '../../shared/services/online.serivce';

@Injectable()
export class TextEffects {
	constructor(
		private actions$: Actions,
		private textService: TextService,
		private onlineService: OnlineService
	) { }
	// get text for offline
	text$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(TextActions.addText),
			switchMap(() => {
				return this.textService.getText()
				.pipe(
					map((words: Word[]) => TextActions.addTextSuccess({words}))
				)
			})
		)
	})

	// when check letter
	checkLetter$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(TextActions.checkLetter),
			switchMap((letters) => {
				return this.textService.checkLetter(letters)
				.pipe(
					map((word: Update<Word>) => TextActions.sendResult({word}))
				)
			})
		)
	})
	
	// when click backspace 
	clickBackspace$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(TextActions.clickBackspace),
			switchMap((positionCursor, gettedWord) => {
				return this.textService.clickBackspace(positionCursor)
				.pipe(
					map((word: Update<Word>) => TextActions.sendResult({word}))
				)
			})
		)
	})
	
	// when cursor has changed
	changeCursor$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(TextActions.changeCursorCoordinates),
			switchMap(coordinates => {
				return this.textService.changeCursor(coordinates)
				.pipe(
					map((word: Update<Word>) => TextActions.changeCursorSuccess({word}))
				)
			})
		)
	})
}