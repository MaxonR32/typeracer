import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { FormControl, FormGroup } from '@angular/forms';

import { InputActions, TextActions } from '../../../state/actions'
import * as fromTextSelector from '../../../state/selectors/text.selectors'
import * as fromTextErrorSelector from '../../../state/reducers'
import { AppState } from '../../../state/reducers'
import { Observable, Subscription } from 'rxjs';
import { Letter, Word, User } from '../../../interface'
import { Event, Router } from '@angular/router';
import { selectInput } from '../../../state/selectors/input.selectors'
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-text-for-write',
  templateUrl: './text-for-write.component.html',
  styleUrls: ['./text-for-write.component.scss'],
})
export class TextForWriteComponent implements OnInit {
  
  @Input() textForWrite: Word[] 
  @Input() disabledInput: boolean 
  
  @Output() emitDistance = new EventEmitter<{distance: number, typedEntrie: number}>()

  @ViewChild('textBlock') private textBlock: ElementRef<any>
  
  idForSend: number = 0  
  idForSendWord: number = 0    
  idForSendLetter: number = 0    
  customIdForSend: number = 0
  textErrorId: number | null


  letterSate: string = 'start'

  letter$: Observable<Letter>
  gettedWord: Word
  more: Letter[]
  lengthInput: number
  arrInputValueLength: number[] = []
  keyCode: number
  typedEntries: number = 0

  form: FormGroup
  lastValue: string
  lastLength: number
  idWord: number = 0
  idCursor: number = 0
  distanceOfCar: number = 0
  
  startInput: boolean = false
  
  constructor(
    private store: Store<AppState>,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      inputText: new FormControl({value: null, disabled: true})
    })
    
    this.store.pipe(select(selectInput)).subscribe(({typedValue, length}) => {
      this.lastValue = typedValue
      this.lastLength = length
    })  
  }

  get inputValue() {
    return this.form.value.inputText
  }

  onRestart() {
    this.idForSend = 0  
    this.idForSendWord = 0    
    this.idForSendLetter = 0    
    this.customIdForSend = 0
    this.typedEntries = 0
    this.idCursor = 0
    this.distanceOfCar = 0
    this.emitDistance.emit({distance: this.distanceOfCar, typedEntrie: this.typedEntries})

    this.form.reset()
  }
  
  // enable form and focus on element before start 
  enableFormMethod() {
    this.form.controls['inputText'].enable()
    this.el.nativeElement.querySelector('.input-text').focus()
  }

  disableFormMethod() {
    this.form.controls['inputText'].disable()
    this.form.reset()
  }

  getWordMethod(id) {
    this.store.pipe(select(fromTextSelector.selectOneLetter, {id})).subscribe(data => {
      this.gettedWord = data
    })
  }


  getKeyCode(event) {
    return this.keyCode = event.keyCode
  }

  getCursorCodeClick(event) {
    this.startInput = false    
    this.getWordMethod(this.idForSendWord)
    let startCursor = event.target.selectionStart 
    let endCursor = event.target.selectionEnd
    let keyCode = event.keyCode
    if(startCursor == 0) {
      this.startInput = true
    } 

    this.store.dispatch(TextActions.changeCursorCoordinates({startCursor: startCursor - 1, endCursor, gettedWord: this.gettedWord}))
  }

  cdk(event) {
      this.startInput = false      

    this.getWordMethod(this.idForSendWord)
    let startCursor = event.target.selectionStart 
    let endCursor = event.target.selectionEnd
    let keyCode = event.keyCode

    if(startCursor == 0) {
      this.startInput = true
    } 


    if(keyCode === 37 || keyCode === 39) {
      this.store.dispatch(TextActions.changeCursorCoordinates({startCursor: startCursor - 1, endCursor, gettedWord: this.gettedWord}))
      return 
    }

    this.store.dispatch(TextActions.changeCursorCoordinates({startCursor: startCursor - 1, endCursor, gettedWord: this.gettedWord}))
  }

  getCursorCode(event) {
    this.getWordMethod(this.idForSendWord)
    let startCursor = event.target.selectionStart 
    let endCursor = event.target.selectionEnd
    let keyCode = event.keyCode

    if(startCursor == 0) {
      this.startInput = true
    } else {
      this.startInput = false  
    } 

    this.store.dispatch(TextActions.changeCursorCoordinates({startCursor: startCursor - 1, endCursor, gettedWord: this.gettedWord}))
  }

  checkLetter(event)  {
    let eventTargetValue = event.target.value
    let value = event.data
    let startCursor = event.target.selectionStart
    let inputLength = event.target.value.length
    this.getWordMethod(this.idForSendWord)
    this.typedEntries += 1

    // when click space
    if(this.keyCode === 32) {
      // get error if exists
      this.store.pipe(select(fromTextErrorSelector.selectTextError)).subscribe(data => {
        this.textErrorId = data
      })
      // if not global error and last letter is space we reset input
      if(this.textErrorId === null && this.gettedWord.letters[startCursor - 2].lastLetter === true) {        
        this.idForSendWord += 1
        this.form.reset()
        this.distanceOfCar += 15
        this.emitDistance.emit({distance: this.distanceOfCar, typedEntrie: this.typedEntries})

        if(window.innerWidth <= 400) {
          if(this.idForSendWord % 7 === 0) {
            this.textBlock.nativeElement.scrollTop += 17
          }
        } else if(window.innerWidth <= 500) {
          if(this.idForSendWord % 18 === 0) {
            this.textBlock.nativeElement.scrollTop += 17
          }
        }  
      
        return 
      }
    }

      let letterForCheck = {
        wordId: this.idForSendWord,
        letterId: startCursor - 1,
        value,
        inputData: eventTargetValue
      }

      let sendForCheck = {
        letterForCheck,
        inputLength,
        gettedWord: this.gettedWord
      }
      this.customIdForSend = this.idForSend 

      this.store.dispatch(TextActions.checkLetter(sendForCheck))
      this.store.dispatch(InputActions.wirtennText({typedValue: eventTargetValue}))
      this.idForSendLetter += 1

  }
}