import { Component, OnInit } from '@angular/core';
import { CountryService } from '../services/country.service';
import { Country } from '../models/country.model';

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

  public get MarketplaceViewMode() {
    return MarketplaceViewMode;
  }

  constructor(private countryService: CountryService) {
  }

  public ngOnInit() {
    this.countryService.getList()
      .subscribe((list: Array<Country>) => this.countries = list);
  }
}


