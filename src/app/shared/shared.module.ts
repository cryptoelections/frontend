import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
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
import {AccordionModule, AlertModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, TooltipModule} from 'ngx-bootstrap';
import {FilterComponent} from './components/filters/filter.component';
import {ConvertPipe} from './pipes/convert.pipe';
import {LoaderComponent} from './components/loader/loader.component';
import {LoadingDirective} from './directives/loading.directive';
import {EthPipe} from './pipes/eth.pipe';
import {NicknamesService} from './services/nicknames.service';
import {Web3Service} from './services/web3.service';
import {CityModalComponent} from './components/city-modal.component';
import {CountryModalComponent} from './components/country-modal.component';
import {CountryModalContainerComponent} from './components/country-modal.container';
import {AuthService} from './services/auth.service';
import {ToastrModule} from 'ngx-toastr';


@NgModule({
  declarations: [
    CityModalComponent,
    ConvertPipe,
    CountryModalComponent,
    CountryModalContainerComponent,
    EthPipe,
    FilterComponent,
    HighLightPipe,
    LoaderComponent,
    LoadingDirective,
    ParametersPairComponent
  ],
  imports: [
    AccordionModule,
    AlertModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    PaginationModule,
    PopoverModule,
    ProgressbarModule,
    ToastrModule,
    TooltipModule,
    TranslateModule
  ],
  exports: [
    AccordionModule,
    AlertModule,
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
    ToastrModule,
    TooltipModule,
    TranslateModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    AuthServiceLoader,
    BaseService,
    CityService,
    ConfigService,
    CountryService,
    NicknamesService,
    StorageService,
    Web3Service
  ],
  entryComponents: [LoaderComponent, CityModalComponent, CountryModalContainerComponent]
})
export class SharedModule {
}
