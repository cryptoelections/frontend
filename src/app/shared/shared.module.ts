import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceLoader } from './services/auth-service.loader';
import { AuthGuard } from './services/auth.guard';
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
import {
  AccordionModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
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
    AccordionModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    PaginationModule,
    PopoverModule,
    ProgressbarModule,
    TooltipModule,
    TranslateModule
  ],
  exports: [
    AccordionModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ConvertPipe,
    FilterComponent,
    FormsModule,
    HighLightPipe,
    HttpClientModule,
    ModalModule,
    PaginationModule,
    ParametersPairComponent,
    PopoverModule,
    ProgressbarModule,
    TranslateModule,
    TooltipModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    AuthServiceLoader,
    BaseService,
    CityService,
    ConfigService,
    CountryService,
    StorageService
  ],
})
export class SharedModule {
}
