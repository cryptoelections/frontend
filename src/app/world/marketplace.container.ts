import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../shared/ngrx';
import * as city from '../shared/ngrx/city/city.actions';
import * as country from '../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-marketplace-container',
  template: `<app-marketplace></app-marketplace>`
})
export class MarketplaceContainerComponent {
  constructor(private store: Store<State>) {
    this.store.dispatch(new city.LoadCitiesRequest());
    this.store.dispatch(new country.LoadCountriesRequest());
  }
}


