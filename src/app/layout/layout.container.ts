import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../shared/ngrx';
import * as common from '../shared/ngrx/common/common.reducers';

@Component({
  selector: 'app-layout-container',
  template: `
    <app-layout [errors]="errors$ | async"></app-layout>`
})
export class LayoutContainerComponent {
  readonly errors$ = this.store.select(common.getErrors);

  constructor(private store: Store<State>) {
  }
}
