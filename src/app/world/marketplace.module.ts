import {NgModule} from '@angular/core';
import {CityCardComponent} from './city/city-card.component';
import {CityFilterComponent} from './city/city-filter.component';
import {CityListComponent} from './city/city-list.component';
import {CountryCardComponent} from './country/country-card.component';
import {CountryFilterComponent} from './country/country-filter.component';
import {CountryListComponent} from './country/country-list.component';
import {CountryListContainerComponent} from './country/country-list.container';
import {CountryEffects} from '../shared/ngrx/country/country.effects';
import {CityEffects} from '../shared/ngrx/city/city.effects';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {countryReducers} from '../shared/ngrx/country/country.reducers';
import {cityReducers} from '../shared/ngrx/city/city.reducers';
import {CityListContainerComponent} from './city/city-list.container';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MetamaskComponent} from './metamask/metamask.component';
import {MyCampaignComponent} from './my-campaign/my-campaign.component';
import {MyCampaignContainerComponent} from './my-campaign/my-campaign.container';
import {myCampaignReducers} from '../shared/ngrx/my-campaign/my-campaign.reducers';
import {MyCampaignEffects} from '../shared/ngrx/my-campaign/my-campaign.effects';
import {MyCountryComponent} from './my-campaign/my-country.component';
import {MyCityComponent} from './my-campaign/my-city.component';
import {MyCampaignFilterComponent} from './my-campaign/my-campaign-filter.component';
import {nicknamesReducer} from '../shared/ngrx/nicknames/nicknames.reducers';
import {NicknamesEffects} from '../shared/ngrx/nicknames/nicknames.effects';
import {commonReducers} from '../shared/ngrx/common/common.reducers';
import {CommonEffects} from '../shared/ngrx/common/common.effects';
import {MyWalletComponent} from './my-campaign/my-wallet.component';
import {MapComponent} from './map/map.component';
import {MapContainerComponent} from './map/map.container';


@NgModule({
  declarations: [
    CityCardComponent,
    CityFilterComponent,
    CityListComponent,
    CityListContainerComponent,
    CountryCardComponent,
    CountryFilterComponent,
    CountryListComponent,
    CountryListContainerComponent,
    MapComponent,
    MapContainerComponent,
    MetamaskComponent,
    MyCampaignFilterComponent,
    MyCampaignComponent,
    MyCampaignContainerComponent,
    MyCityComponent,
    MyCountryComponent,
    MyWalletComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([CountryEffects, CityEffects, MyCampaignEffects, NicknamesEffects, CommonEffects]),
    RouterModule,
    SharedModule,
    StoreModule.forFeature('countries', countryReducers),
    StoreModule.forFeature('cities', cityReducers),
    StoreModule.forFeature('myCampaign', myCampaignReducers),
    StoreModule.forFeature('nicknames', nicknamesReducer),
    StoreModule.forFeature('common', commonReducers)
  ],
  providers: [],
})
export class MarketplaceModule {
}
