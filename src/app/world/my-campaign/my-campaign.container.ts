import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../shared/ngrx';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-my-campaign-container',
  template: `
    <app-my-campaign [countries]="countries$ | async"
                     [cities]="citiesByCountries$ | async"
                     [myCities]="[]"></app-my-campaign>`
})
export class MyCampaignContainerComponent {
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly citiesByCountries$ = this.store.select(fromCities.citiesByCountriesEntities);
  readonly myCities$ = this.store.select(fromMyCampaign.selectFilteredList);

  constructor(private store: Store<State>) {
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new cityActions.LoadCitiesRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
  }
}
