import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {NicknamesService} from '../../services/nicknames.service';

import * as nicknameActions from './nicknames.actions';

@Injectable()
export class NicknamesEffects {
  @Effect()
  loadNicknames$: Observable<Action> = this.actions$
    .ofType(nicknameActions.LOAD_NICKNAMES_REQUEST)
    .switchMap((action: nicknameActions.LoadNicknamesRequest) => Observable.timer(0, 60000)
      .switchMap(() => this.nicknames.getDynamic()
        .map((res) => new nicknameActions.LoadNicknamesResponse(res))));

  constructor(private actions$: Actions,
              private nicknames: NicknamesService) {
  }
}
