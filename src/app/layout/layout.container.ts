import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../shared/ngrx';
import * as common from '../shared/ngrx/common/common.reducers';

@Component({
  selector: 'app-layout-container',
  template: `
    <app-layout></app-layout>`
})
export class LayoutContainerComponent {
  constructor(private store: Store<State>) {
  }
}
