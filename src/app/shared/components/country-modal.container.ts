import {Component} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from '../ngrx';
import * as fromCountries from '../ngrx/country/country.reducers';
import * as fromCities from '../ngrx/city/city.reducers';
import * as myCampaignActions from '../ngrx/my-campaign/my-campaign.actions';
import * as cityActions from '../ngrx/city/city.actions';

@Component({
  selector: 'app-country-modal-container',
  template: `
    <app-country-modal [bsModalRef]="bsModalRef"
                       [countries]="countries$ | async"
                       [countryId]="countryId"
                       [cities]="cities$ | async"
                       [myCities]="myCities$ | async"
                       (ruleCountry)="ruleCountry()"
    ></app-country-modal>
  `
})
export class CountryModalContainerComponent {
  public countryId: number;

  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly cities$ = this.store.select(fromCountries.citiesByCountriesEntities);
  readonly myCities$ = this.store.select(fromCountries.selectAllByCountries);
  readonly loading$ = this.store.select(fromCountries.isLoading)
    .withLatestFrom(this.store.select(fromCities.isLoading))
    .map(loadings => loadings.find(l => l));

  constructor(public bsModalRef: BsModalRef,
              private router: Router,
              private store: Store<State>) {
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
  }

  public ruleCountry() {
    this.bsModalRef.hide();
    this.router.navigate(['/my']);
  }
}
