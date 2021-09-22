import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar' 

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class MaterialModule { }