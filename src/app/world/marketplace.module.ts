import { NgModule } from '@angular/core';
import { CityCardComponent } from './city/city-card.component';
import { CityFilterComponent } from './city/city-filter.component';
import { CityListComponent } from './city/city-list.component';
import { CountryCardComponent } from './country/country-card.component';
import { CountryFilterComponent } from './country/country-filter.component';
import { CountryListComponent } from './country/country-list.component';
import { CountryListContainerComponent } from './country/country-list.container';
import { CountryEffects } from '../shared/ngrx/country/country.effects';
import { CityEffects } from '../shared/ngrx/city/city.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { countryReducers } from '../shared/ngrx/country/country.reducers';
import { cityReducers } from '../shared/ngrx/city/city.reducers';
import { CityListContainerComponent } from './city/city-list.container';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CityDetailsComponent } from './city/details/city-details.component';
import { CountryDetailsComponent } from './country/details/country-details.component';
import { RouterModule } from '@angular/router';
import { CityDetailsContainerComponent } from './city/details/city-details.container';
import { CountryDetailsContainerComponent } from './country/details/country-details.container';
import { MyCampaignComponent } from './my-campaign/my-campaign.component';
import { MyCampaignContainerComponent } from './my-campaign/my-campaign.container';
import { myCampaignReducers } from '../shared/ngrx/my-campaign/my-campaign.reducers';
import { MyCampaignEffects } from '../shared/ngrx/my-campaign/my-campaign.effects';
import { MyCountryComponent } from './my-campaign/my-country.component';
import { MyCityComponent } from './my-campaign/my-city.component';

@NgModule({
  declarations: [
    CityCardComponent,
    CityDetailsComponent,
    CityDetailsContainerComponent,
    CityFilterComponent,
    CityListComponent,
    CityListContainerComponent,
    CountryCardComponent,
    CountryDetailsComponent,
    CountryDetailsContainerComponent,
    CountryFilterComponent,
    CountryListComponent,
    CountryListContainerComponent,
    MyCampaignComponent,
    MyCampaignContainerComponent,
    MyCityComponent,
    MyCountryComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([CountryEffects, CityEffects, MyCampaignEffects]),
    RouterModule,
    SharedModule,
    StoreModule.forFeature('countries', countryReducers),
    StoreModule.forFeature('cities', cityReducers),
    StoreModule.forFeature('myCampaign', myCampaignReducers),
  ],
  providers: [],
})
export class MarketplaceModule {
}
