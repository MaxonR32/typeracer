export interface Word {
	id: number
	letters: Letter[]
}

export interface Letter {
	id: number
	value: string
	valid: boolean
	invalid: boolean
	selected: boolean
	cursor: boolean
	allFalse: boolean
	lastLetter: boolean
	firstLetter: boolean,
	lastLetterFromText: boolean
}

export interface GetText {
	textForWrite: string
}

export interface LetterForCheck {
	id: number
	value: string
}

export interface User {
	userName: string
	ready: boolean
	distance: number
	wpm: number
}

export interface Online {
	online: boolean
	roomName: string
	userName: string
}

export interface UpdateStr<T> {
	id: string
	changes: Partial<T>
}


export interface UpdateNum<T> {
	id: number
	changes: Partial<T>
}

export declare type Update<T> = UpdateStr<T> | UpdateNum<T>	