import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';

import * as fromNicknames from '../../shared/ngrx/nicknames/nicknames.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';

@Component({
  selector: 'app-footer-container',
  template: `
    <app-footer [nicknames]="nicknames$ | async"
                [countries]="countries$ | async"></app-footer>`
})
export class FooterContainerComponent {
  readonly nicknames$ = this.store.select(fromNicknames.selectEntities);
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  // readonly countries$ = this.store.select(fromCountries.selectEntities);

  constructor(private store: Store<State>) {
  }
}
