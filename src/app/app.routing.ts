import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthServiceLoader } from './shared/services/auth-service.loader';
import { AuthGuard } from './shared/services/auth.guard';
import { CountryListContainerComponent } from './world/country/country-list.container';
import { CityListContainerComponent } from './world/city/city-list.container';
import { MetamaskComponent } from './world/metamask/metamask.component';
import { MyCampaignContainerComponent } from './world/my-campaign/my-campaign.container';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'countries',
    component: CountryListContainerComponent
  },
  {
    path: 'cities',
    component: CityListContainerComponent
  },
  // {
  //   path: 'map',
  //   component: MarketplaceContainerComponent
  // },
  {
    path: 'my',
    component: MyCampaignContainerComponent,
    canActivate: [AuthServiceLoader],
    canActivateChild: [AuthGuard]
  }, {
    path: 'metamask',
    component: MetamaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
