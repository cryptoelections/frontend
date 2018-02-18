import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClient} from '@angular/common/http';
import {HeaderComponent} from './layout/header/header.component';
import {AppRoutingModule} from './app.routing';
import {HomeComponent} from './home/home.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ConfigService} from './shared/services/config.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Web3Service} from './shared/services/web3.service';
import {MarketplaceModule} from './world/marketplace.module';
import {SharedModule} from './shared/shared.module';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './shared/ngrx';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AccordionModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, TooltipModule} from 'ngx-bootstrap';
import {FooterComponent} from './layout/footer/footer.component';
import {LayoutComponent} from './layout/layout.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function InitAppFactory(web3: Web3Service,
                               http: HttpClient,
                               configService: ConfigService) {
  return () => http.get('config/config.json').toPromise()
    .then(data => configService.parse(data))
    .then(() => setInterval(() => web3.getAccount(), 100));
}


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LayoutComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    EffectsModule.forRoot([]),
    MarketplaceModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    SharedModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument(),
    TooltipModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [Web3Service, HttpClient, ConfigService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
