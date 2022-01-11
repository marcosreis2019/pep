import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { CanalService } from './canal.service';
import { CanalActions } from './canal.actions';
import { AtendimentoSelect } from '../atendimento/atendimento.selector';
import { CanalSelect } from './canal.selectors';

@Injectable()
export class CanalEffects {
  constructor(
    private actions$: Actions,
    private canalServ: CanalService
  ) { }  


}
