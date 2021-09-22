import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as fromUsers from '../../../state/selectors/user.selector'
import { User } from '../../../interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-result',
  templateUrl: './show-result.component.html',
  styleUrls: ['./show-result.component.scss']
})
export class ShowResultComponent implements OnInit {
  
   users$: Observable<User[]>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {
    this.users$ = this.store.pipe(select(fromUsers.selectUsers))
      
  }


  ngOnInit(): void {
    // this.users$.subscribe(data => console.log('data', data))
  }

}
