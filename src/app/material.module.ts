import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar' 
import { MatFormFieldModule } from '@angular/material/form-field'

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule
  ]
})
export class MaterialModule { }