import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private store: Store<PEPState>, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return of(next.queryParams).pipe(
      switchMap(params =>
        this.store.pipe(
          map(state => {
            let auth: boolean = false
            if (state.profissional && state.profissional.pro) {
              auth = !!state.profissional.pro.id
            }

            if (auth) {
              return true
            } else {
              this.router.navigate(['/login'])
              return false
            }
          })
        )
      )
    )
  }
}
