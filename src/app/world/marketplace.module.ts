import { NgModule } from '@angular/core';
import { CityCardComponent } from './city/city-card.component';
import { CityFilterComponent } from './city/city-filter.component';
import { CityListComponent } from './city/city-list.component';
import { CountryCardComponent } from './country/country-card.component';
import { CountryFilterComponent } from './country/country-filter.component';
import { CountryListComponent } from './country/country-list.component';
import { CountryListContainerComponent } from './country/country-list.container';
import { MarketplaceComponent } from './marketplace.component';
import { CountryEffects } from '../shared/ngrx/country/country.effects';
import { CityEffects } from '../shared/ngrx/city/city.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { countryReducers } from '../shared/ngrx/country/country.reducers';
import { cityReducers } from '../shared/ngrx/city/city.reducers';
import { MarketplaceContainerComponent } from './marketplace.container';
import { CityListContainerComponent } from './city/city-list.container';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CityDetailsComponent } from './city/details/city-details.component';
import { CountryDetailsComponent } from './country/details/country-details.component';
import { RouterModule } from '@angular/router';
import { CityDetailsContainerComponent } from './city/details/city-details.container';
import { CountryDetailsContainerComponent } from './country/details/country-details.container';

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
    MarketplaceComponent,
    MarketplaceContainerComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([CountryEffects, CityEffects]),
    RouterModule,
    SharedModule,
    StoreModule.forFeature('countries', countryReducers),
    StoreModule.forFeature('cities', cityReducers),
  ],
  providers: [],
})
export class MarketplaceModule {
}
