import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar' 
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner' 
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }