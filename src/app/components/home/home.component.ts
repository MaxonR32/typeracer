import { Component, OnInit } from '@angular/core';
import { OnlineService } from '../../shared/services/online.serivce'
import { Store } from '@ngrx/store';
import { OnlineActions, TextActions, GuardActions } from '../../state/actions'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private onlineService: OnlineService,
    private store: Store
  ) { }

  ngOnInit(): void {
    // delete users from ngrx   
    this.store.dispatch(OnlineActions.deleteUser())
    // clear text from ngrx
    this.store.dispatch(TextActions.clearTextOnDestroy())
  }

  changeGuard() {
    this.store.dispatch(GuardActions.changeGuardTrue())
  }


  experiment() {
    // this.onlineService.experiment().subscribe(data => console.log('data', data))
  }

}
