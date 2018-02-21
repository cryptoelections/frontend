import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import * as commonActions from './common.actions';

@Injectable()
export class CommonEffects {
  constructor(private actions$: Actions) {
  }
}
