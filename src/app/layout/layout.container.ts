import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../shared/ngrx';
import * as commonActions from '../shared/ngrx/common/common.actions';

@Component({
  selector: 'app-layout-container',
  template: `
    <app-layout></app-layout>`
})
export class LayoutContainerComponent {
  constructor(private store: Store<State>) {
    this.store.dispatch(new commonActions.LoadAllData());
  }
}
