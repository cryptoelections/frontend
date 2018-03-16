import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';

@Component({
  selector: 'app-footer-container',
  template: `
    <app-footer></app-footer>`
})
export class FooterContainerComponent {

  constructor(private store: Store<State>) {
  }
}
