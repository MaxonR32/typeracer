import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Store, select } from '@ngrx/store';

import * as fromGuardSelectors from '../../state/selectors/guard.selectors'
import { map } from 'rxjs/operators';

@Injectable()
export class PageGuard implements CanActivate{
  
    guard$: Observable<any>
  
    constructor(
      private store: Store,
      private router: Router
    ) {
      this.guard$ = this.store.pipe(select(fromGuardSelectors.selectGuard))
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.guard$.pipe(map(object => {
        if(object.guard === true) {
          return true
        }
        this.router.navigate(['/home'])
        return false
      }))
    }
}