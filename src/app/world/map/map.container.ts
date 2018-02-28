import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';

import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as nicknamesActions from '../../shared/ngrx/nicknames/nicknames.actions';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-map-container',
  template: `
    <app-map [countries]="countries$ | async"
             [cities]="allCities$ | async"
             [myCitiesByCountry]="myCitiesByCountry$ | async"></app-map>`
})
export class MapContainerComponent {
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly allCities$ = this.store.select(fromCities.selectAll);
  readonly myCitiesByCountry$ = this.store.select(fromCountries.selectAllByCountries);

  constructor(private store: Store<State>) {
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new nicknamesActions.LoadNicknamesRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
  }
}
