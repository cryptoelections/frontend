import { Component, OnInit } from '@angular/core';
import { CountryService } from '../shared/services/country.service';
import { Country } from '../shared/models/country.model';
import { City } from '../shared/models/city.model';
import { CityService } from '../shared/services/city.service';

export enum MarketplaceViewMode {
  Countries = 'COUNTRIES',
  Cities = 'CITIES'
}

@Component({
  selector: 'app-marketplace',
  templateUrl: 'marketplace.component.html'
})
export class MarketplaceComponent implements OnInit {
  public viewMode = MarketplaceViewMode.Countries;
  public modes = [{
    mode: MarketplaceViewMode.Countries,
    title: 'MARKETPLACE.VIEWMODE.COUNTRIES'
  }, {
    mode: MarketplaceViewMode.Cities,
    title: 'MARKETPLACE.VIEWMODE.CITIES'
  }];

  public countries: Array<Country>;
  public cities: Array<City>;

  public get MarketplaceViewMode() {
    return MarketplaceViewMode;
  }

  constructor(private countryService: CountryService,
              private cityService: CityService) {
  }

  public ngOnInit() {
    this.countryService.getList().subscribe((list: Array<Country>) => this.countries = list);
    this.cityService.getList().subscribe((list: Array<City>) => this.cities = list);
  }
}


