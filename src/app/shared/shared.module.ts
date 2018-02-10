import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { StorageService } from './services/storage.service';
import { CountryService } from './services/country.service';
import { CityService } from './services/city.service';
import { BaseService } from './services/base.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParametersPairComponent } from './components/parameter-pair/parameter-pair.component';
import { FormsModule } from '@angular/forms';
import { HighLightPipe } from './pipes/highlight.pipe';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { FilterComponent } from './components/filters/filter.component';
import { ConvertPipe } from './pipes/convert.pipe';


@NgModule({
  declarations: [
    ConvertPipe,
    FilterComponent,
    HighLightPipe,
    ParametersPairComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    PaginationModule,
    TooltipModule,
    TranslateModule
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ConvertPipe,
    FilterComponent,
    FormsModule,
    HighLightPipe,
    HttpClientModule,
    PaginationModule,
    ParametersPairComponent,
    TranslateModule,
    TooltipModule
  ],
  providers: [
    AuthService,
    BaseService,
    CityService,
    ConfigService,
    CountryService,
    StorageService
  ],
})
export class SharedModule {
}
