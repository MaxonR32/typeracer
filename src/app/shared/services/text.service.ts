import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Letter, GetText, Word } from '../../interface'
import { TextErrorActions, FinishActions } from '../../state/actions';
import { OnlineService } from './online.serivce'

import * as fromTextSelector from '../../state/reducers'
import * as fromInputSelecor from '../../state/selectors/input.selectors'
import * as fromOnlineSelector from '../../state/selectors/online.selector'

@Injectable({providedIn: 'root'}) 
export class TextService {
  
  randomNumber: number 
  // heleper for create letter
  a: number = -1
  b: number = -1
  c: number = -1
  k: number = -1
  tutorial: AngularFireObject<any>

  finishText: Word[] = []
  simpleArr: number[] = []
  wordObj: Word
  letterObj: Letter
  textErrorId: number | null
  globalError: boolean = false
  data: any
  
  sliceNumber: number = 60

  constructor(
    private db: AngularFireDatabase,
    private firestore: AngularFirestore,
    private store: Store,
  ) {}


  getText(): Observable<Word[]> {
    let random = Math.floor(Math.random() * 1250)
    let str
    return this.firestore.collection('text').valueChanges().pipe(map(objectText => {
      let t = objectText[0] as GetText
      let allText = t.textForWrite
      // transfomr in array for all word
      let text = allText.split(' ')
      // cut array 
      str = text.slice(random, random + this.sliceNumber)        

      return this.convertText(str)
    }))
  }

  convertText(text): Word[] {
    let finishText: Word[] = []
    this.a = -1
    this.b = -1
      text.forEach(word => {
        this.a += 1
        
        let newArr: Letter[] = []
        let lastLetter = word.slice(-1);
        let lastIndexOfLetter = word.lastIndexOf(lastLetter)
        
        for(let letter of word) {
          this.b += 1
          this.c += 1
          this.k += 1
          this.letterObj = {
            id: this.b,
            value: letter,
            valid: false,
            invalid: false,
            selected: false,
            cursor: false,
            allFalse: false,
            lastLetter: letter === lastLetter && lastIndexOfLetter === this.c ? true : false,
            firstLetter: this.k === 0 ? true : false,
            lastLetterFromText: (this.a + 1) === this.sliceNumber && lastIndexOfLetter === this.c ? true : false
          }
          newArr.push(this.letterObj)
        }
         this.b = -1
         this.c = -1
         this.k = -1
        this.wordObj = {
          id: this.a,
          letters: newArr
        }
        newArr = []
        finishText.push(this.wordObj)
      }) 
       return finishText
  }

  checkLetters(letter): Observable<Update<Letter>> {
    let changedLetters: Letter[] = []
    // get last first id of not correct letter
    this.store.pipe(select(fromTextSelector.selectTextError)).subscribe(data => {
      this.textErrorId = data
    })

    // let changedLetter
    let result
    let gettedLetter = letter.gettedWord
    let sendedLetter = letter.letterForCheck
    let sendedLetterId = sendedLetter.letterId
    let inputLength = letter.inputLength
    let inputData = letter.inputData

    
    // create Observable
    let obs = Observable.create((observer) => {
      // if input length is more but word
      if(sendedLetter.letterId >= gettedLetter.letters.length) {
        changedLetters = gettedLetter.letters.map(letter => {
          return {
            ...letter,
            allFalse: true
          }
        })
        result = {
          id: gettedLetter.id,
          changes: {
            letters: changedLetters
          }
        }

        observer.next(result)
      }

      // when letter is correct
      else if(gettedLetter.letters[sendedLetterId].value === sendedLetter.value) {
        // when letter is correct but some letter is wrong back
        if(this.textErrorId !== null) {
         
          if(gettedLetter.id > this.textErrorId) {
          
            // all letter will recive invalid because exists wrong letter
            this.globalError = true
          }
        }
        changedLetters = gettedLetter.letters.map(letter => {
          if(letter.id === sendedLetter.letterId && letter.value === sendedLetter.value) {
            // if previous letter is not corect
            if(this.textErrorId !== null) { //&& letter.id >= this.textErrorId
              return {
                ...letter,
                valid: false,
                invalid: true,
                allFalse: false
              }
            }
            // if letter is correct
            if(letter.lastLetterFromText === true) {
              this.store.dispatch(FinishActions.finishTrue())
            }
            return {
              ...letter,
              valid: true,
              invalid: false,
              allFalse: false
            }
          }
          // return other letter
          return letter
        })
        // create result
        result = {
          id: gettedLetter.id,
          changes: {
            letters: changedLetters
          }
        }
        observer.next(result)
      }

      // when delete data from input
      else if (sendedLetter.value === null) {
         if(this.textErrorId !== null) {
          if(sendedLetterId <= this.textErrorId) {
            this.globalError = false
            this.store.dispatch(TextErrorActions.changeErrorToFalse({id: null}))
          }
        }
        changedLetters = gettedLetter.letters.map(letter => {
        // when input text is more than word
        if (sendedLetterId >= gettedLetter.letters.length) {
          return {
            ...letter,
            allFalse: true 
          }
        }
        // when delete one letter
        if(letter.id > inputLength - 1) {
          return {
            ...letter,
            valid: false,
            invalid: false,
            allFalse: false 
          } 
        } else {
          // return     
        }
        return {
          ...letter,
          allFalse: false,
        }
      })
      result = {
        id: gettedLetter.id,
        changes: {
          letters: changedLetters
        }
      }
      observer.next(result)

      } 

      // if letter isn't correct
      else {
        changedLetters = gettedLetter.letters.map(letter => {
          // if letter is not correct
          if(letter.id === sendedLetter.letterId && letter.value !== sendedLetter.value) {
            return {
              ...letter,
              valid: false,
              invad: true,
              allFalse: false
            }
          }
          // return other letter
          return letter
        })
        result = {
        id: gettedLetter.id,
        changes: {
          letters: changedLetters
        }
      }
      if(this.textErrorId === null) {
        this.store.dispatch(TextErrorActions.changeErrorToTrue({id: sendedLetter.letterId}))
      }
      observer.next(result)
    }
    })
    return obs
  }

  checkLetter(letter): Observable<Update<Letter>> {
    let changedLetters: Letter[] = []

    this.store.pipe(select(fromTextSelector.selectTextError)).subscribe(data => {
      this.textErrorId = data
    })

    this.store.dispatch(TextErrorActions.changeErrorToFalse({id: null}))

    let result
    let gettedLetter = letter.gettedWord
    let sendedLetter = letter.letterForCheck
    let sendedLetterId = sendedLetter.letterId
    let inputLength = letter.inputLength
    let inputData = sendedLetter.inputData
    return Observable.create(observer => {
      // if input length is more but word
      if(inputData.length > gettedLetter.letters.length) {
        changedLetters = gettedLetter.letters.map(letter => {
          return {
            ...letter,
            allFalse: true
          }
        })
        result = {
          id: gettedLetter.id,
          changes: {
            letters: changedLetters
          }
        }

        observer.next(result)
      }
      else {
        let idx = -1
        changedLetters = gettedLetter.letters.map(letter => {
          idx += 1
          // when input data ended
          if(inputData[idx] === undefined) {
            return {
              ...letter,
              valid: false,
              invalid: false,
              allFalse: false
            }
          } 
          // when letter isn't correct
          else if(inputData[idx] !== letter.value) {
            this.store.dispatch(TextErrorActions.changeErrorToTrue({id: sendedLetter.letterId}))
            return {
              ...letter,
              valid: false,
              invalid: true,
              allFalse: false
            }
          }
           // when letter is correct 
          else if(inputData[idx] === letter.value) {
            // if letter is correct
            if(letter.lastLetterFromText === true) {
              this.store.dispatch(FinishActions.finishTrue())
            }
            return {
              ...letter,
              valid: true,
              invalid: false,
              allFalse: false
            }
          }
        })  
        result = {
            id: gettedLetter.id,
            changes: {
              letters: changedLetters
            }
          }

          observer.next(result)      
      }
    })
  }

  clickBackspace({position, gettedWord, wordId, lengthInput}): Observable<Update<Word>> {
    this.store.pipe(select(fromTextSelector.selectTextError)).subscribe(data => {
      this.textErrorId = data
    })
    position -= 1
    // if position of cursor is smallest with global error id 
    // cahnge ot null
    if(this.textErrorId !== null) {
      if(position <= this.textErrorId) {
        this.globalError = false
        this.store.dispatch(TextErrorActions.changeErrorToFalse({id: null}))
      }
    }
    let changedLetters = gettedWord.letters.map(letter => {
      // when input text is more than word
      if (position >= gettedWord.letters.length) {
        return {
          ...letter,
          allFalse: true 
        }
      }
      // when delete one letter
      if(letter.id > lengthInput - 1) {
        return {
          ...letter,
          valid: false,
          invalid: false,
          allFalse: false 
        }
      }
      return {
        ...letter,
        allFalse: false,
      }
    })

    let obs = Observable.create(observer => {
      let result = {
        id: wordId,
        changes: {
          letters: changedLetters
        }
      }
      observer.next(result)
    })


    return obs
  }

  

  changeCursor(data): Observable<Update<Word>> {
    let changedArray: Letter[] = []
    let result
    let gettedWord = data.gettedWord

    let startCursor = data.startCursor
    let endCursor = data.endCursor

    return Observable.create(observer => {
      changedArray = gettedWord.letters.map(letter => {
        if(endCursor - startCursor > 1) {
          
          if(startCursor + 1 <= letter.id  && endCursor - 1 >= letter.id) {
            return {
              ...letter,
              selected: true,
              cursor: false
            }
          }
        }  
        if(startCursor === letter.id) {
          return {
            ...letter,
            cursor: true,
            selected: false
          }
        } 
        return {
          ...letter,
          cursor: false,
          selected: false
        }
      })
      result = {
       id: gettedWord.id,
       changes: {
         letters: changedArray
       }
     }

     observer.next(result)
    }) 
  }

  resetText(data) {
    data.forEach(o => {
      o.letters.forEach(letter => {
        return {
          ...letter,
          valid: false,
          invalid: false,
          selected: false
        }
      })
    })
  }

  getResult(typedEntries, time): number {
    let result = Math.floor(((typedEntries / 5) / time) * 60)
   return result   
  }
}