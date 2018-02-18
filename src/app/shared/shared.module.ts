import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthServiceLoader} from './services/auth-service.loader';
import {AuthGuard} from './services/auth.guard';
import {ConfigService} from './services/config.service';
import {StorageService} from './services/storage.service';
import {CountryService} from './services/country.service';
import {CityService} from './services/city.service';
import {BaseService} from './services/base.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ParametersPairComponent} from './components/parameter-pair/parameter-pair.component';
import {FormsModule} from '@angular/forms';
import {HighLightPipe} from './pipes/highlight.pipe';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {
  AccordionModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {FilterComponent} from './components/filters/filter.component';
import {ConvertPipe} from './pipes/convert.pipe';
import {LoaderComponent} from './components/loader/loader.component';
import {LoadingDirective} from './directives/loading.directive';
import {EthPipe} from './pipes/eth.pipe';
import {NicknamesService} from './services/nicknames.service';
import {Web3Service} from './services/web3.service';


@NgModule({
  declarations: [
    ConvertPipe,
    EthPipe,
    FilterComponent,
    HighLightPipe,
    LoaderComponent,
    LoadingDirective,
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
    EthPipe,
    FilterComponent,
    FormsModule,
    HighLightPipe,
    HttpClientModule,
    LoaderComponent,
    LoadingDirective,
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
    AuthServiceLoader,
    BaseService,
    CityService,
    ConfigService,
    CountryService,
    NicknamesService,
    StorageService,
    Web3Service
  ],
  entryComponents: [LoaderComponent]
})
export class SharedModule {
}
