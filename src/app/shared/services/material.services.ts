import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class MaterialServices {
	
	constructor(private _snackBar: MatSnackBar) {}

	openSnackbar(message: string) {
		return this._snackBar.open(message, 'close', {
 			horizontalPosition: 'right',
      		verticalPosition: 'top',
      		duration: 700	
      	})	
	}

	opneModalResult(wpm, online) {
		return {
			width: '600px',
			data: {
				wpm,
				online
			}
		}
	}
}