import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './layout/header.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatDividerModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatSelectModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './home/home.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfigService } from './services/config.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BaseService } from './services/base.service';
import { CityService } from './services/city.service';
import { CountryService } from './services/country.service';
import { CityListComponent } from './world/city/city-list.component';
import { CountryListComponent } from './world/country/country-list.component';
import { MarketplaceComponent } from './world/marketplace.component';
import { FormsModule } from '@angular/forms';
import { ParametersPairComponent } from './shared/parameter-pair/parameter-pair.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CityFilterComponent } from './world/city/city-filter.component';
import { AuthService } from './services/auth.service';
import { HighLightPipe } from './pipes/highlight.pipe';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function InitAppFactory(auth: AuthService,
                               http: HttpClient,
                               configService: ConfigService) {
  return () => http.get('config/config.json').toPromise()
    .then(data => configService.parse(data))
    .then(() => auth.getAccount())
}


@NgModule({
  declarations: [
    AppComponent,
    CityFilterComponent,
    CityListComponent,
    CountryListComponent,
    HeaderComponent,
    HighLightPipe,
    HomeComponent,
    MarketplaceComponent,
    ParametersPairComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    BaseService,
    CityService,
    ConfigService,
    CountryService,
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [AuthService, HttpClient, ConfigService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
