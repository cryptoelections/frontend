import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClient} from '@angular/common/http';
import {HeaderComponent} from './layout/header/header.component';
import {AppRoutingModule} from './app.routing';
import {HomeComponent} from './home/home.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ConfigService} from './shared/services/config.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MarketplaceModule} from './world/marketplace.module';
import {SharedModule} from './shared/shared.module';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './shared/ngrx';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AccordionModule, AlertModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, TooltipModule} from 'ngx-bootstrap';
import {FooterComponent} from './layout/footer/footer.component';
import {LayoutComponent} from './layout/layout.component';
import {LayoutContainerComponent} from './layout/layout.container';
import {FooterContainerComponent} from './layout/footer/footer.container';
import {AuthService} from './shared/services/auth.service';
import {ToastrModule} from 'ngx-toastr';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function InitAppFactory(auth: AuthService,
                               http: HttpClient,
                               configService: ConfigService) {
  return () => http.get('config/config.json').toPromise()
    .then(data => configService.parse(data))
    .then(() => setInterval(() => auth.getAccount(), 100));
}


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    FooterContainerComponent,
    HeaderComponent,
    HomeComponent,
    LayoutComponent,
    LayoutContainerComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
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
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      extendedTimeOut: 500,
      timeOut: 7500,
      positionClass: 'toast-bottom-left',
      enableHtml: true
    }),
    TooltipModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [AuthService, HttpClient, ConfigService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
