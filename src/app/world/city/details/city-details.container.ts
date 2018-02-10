import { Component, OnInit } from '@angular/core';
import * as fromCities from '../../../shared/ngrx/city/city.reducers';
import * as cityActions from '../../../shared/ngrx/city/city.actions';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { State } from '../../../shared/ngrx';

@Component({
  selector: 'app-city-details-container',
  template: `
    <app-city-details [city]="city$ | async"></app-city-details>`
})
export class CityDetailsContainerComponent implements OnInit {
  public city$ = this.store.select(fromCities.getSelectedCity);

  constructor(private store: Store<State>,
              private activatedRoute: ActivatedRoute,) {
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new cityActions.LoadSelectedCity(params['id']));
  }
}
