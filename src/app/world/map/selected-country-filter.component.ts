import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {FilterComponent} from '../../shared/components/filters/filter.component';
import {City} from '../../shared/models/city.model';
import {TranslateService} from '@ngx-translate/core';
import {zeroAddress} from '../country/country-card.component';
import {Country} from '../../shared/models/country.model';
import {CitySortOption} from '../city/city-filter.component';

@Component({
  selector: 'app-selected-country-filter',
  templateUrl: './selected-country-filter.component.html',
  styleUrls: ['../../shared/components/filters/filter.component.css']
})
export class SelectedCountryFilterComponent extends FilterComponent implements AfterViewInit {
  @Input() public query: string;
  @Input() public sortBy: CitySortOption = CitySortOption.Name;
  @Input() public countries: { [code: string]: Array<Country> };
  @Input() public allCities: Array<City>;
  @Input() public list: Array<City>;
  @Input() public myCities;
  @Input() public electorate;
  @Input() public isLoading: boolean;
  @Input() public nicknames;
  @Input() public selectedCountryId: string;
  @Input() public selectedCountry: Country;
  @Input() public dynamicCities: Array<Partial<City>>;
  @Input() public dynamic: Country;
  @Output() public sortByChange = new EventEmitter<CitySortOption>();

  public sortOptions = [{
    option: CitySortOption.Name,
    name: 'CITY.FILTER.SORT.NAME'
  }, {
    option: CitySortOption.PriceDown,
    name: 'CITY.FILTER.SORT.PRICE_DOWN'
  }, {
    option: CitySortOption.PriceUp,
    name: 'CITY.FILTER.SORT.PRICE_UP'
  }, {
    option: CitySortOption.PricePerVoteDown,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_DOWN'
  }, {
    option: CitySortOption.PricePerVoteUp,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_UP'
  }, {
    option: CitySortOption.ElectorateDown,
    name: 'CITY.FILTER.SORT.ELECTORATE_DOWN'
  }, {
    option: CitySortOption.ElectorateUp,
    name: 'CITY.FILTER.SORT.ELECTORATE_UP'
  }, {
    option: CitySortOption.Country,
    name: 'CITY.FILTER.SORT.COUNTRY'
  }];


  public get president(): string {
    if (this.dynamic && this.dynamic.president && this.dynamic.president !== zeroAddress) {
      return this.nicknames && this.nicknames[this.dynamic.president] || this.dynamic.president;
    } else {
      return this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET');
    }
  }

  public get numberOfCities() {
    return this.list ? this.list.length : 0;
  }

  public get numberOfMyCities() {
    return this.myCities && this.myCities.filter(c => c.country === this.selectedCountry.code).length;
  }


  public get myElectorate(): number {
    let count = 0;
    if (this.myCities && this.myCities.length) {
      this.myCities.forEach((city: City) => count += +city.population);
    }
    return count;
  }

  constructor(private translate: TranslateService,
              private cd: ChangeDetectorRef) {
    super();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
