import { Component, Input } from '@angular/core';
import { Country } from '../../shared/models/country.model';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-my-country',
  template: `
    <accordion-group #group>
      <div accordion-heading class="row my-country-header">
        <button class="btn key-country">
          <i class="fas" [ngClass]="group.isOpen ? 'fa-sort-up' : 'fa-sort-down'"></i>
        </button>
        <div class="my-country-image">
          <img
            [src]="'assets/images/country-flags/large/' + country.code.toLowerCase() + '.png'"
            alt=""
          />
        </div>
        <div
          class="country-name col-md-4 col-xs-12"
          [tooltip]="country.name"
          position="auto"
        ><h2>{{ country.name
          }}</h2></div>
        <div class="progressbar col-md-4 col-xs-12">
          <progressbar max="100" [value]="percentage">
            <i>{{ citiesOfCountry && citiesOfCountry.length }}
              {{ citiesOfCountry.length === 1 ? 'CAMPAIGN.CITY' : 'CAMPAIGN.CITIES' | translate}}</i>
          </progressbar>
          <span>{{ percentage }}%</span>
        </div>
        <div class="col-md-2 col-xs-12 text-right">
          <button class="btn card-button country-button" *ngIf="percentage < 50">
            <div class="btn-left">
              <span>{{ 'COUNTRY.CARD.BUY_FOR' | translate:params }}</span><br/>
              {{'COUNTRY.CARD.TO_WIN' | translate }}
            </div>
            <div class="btn-right"><b>{{ sellParams.price }}</b><br/> ETH</div>
          </button>
          <!-- todo add president badge-->
        </div>
      </div>
      <ng-container *ngFor="let city of citiesOfCountry; let i = index">
        <app-my-city
          [city]="city"
          [first]="i === 0"
          [cities]="citiesOfCountry"
        ></app-my-city>
      </ng-container>
    </accordion-group>
  `
})
export class MyCountryComponent {
  private _percentage: number;

  @Input() public country: Country;
  @Input() public citiesOfCountry: Array<City>;

  @Input()
  public set percentage(value: number) {
    this._percentage = +value;
  }

  public get percentage(): number {
    return this._percentage;
  }

  @Input() public sellParams: { numberOfCities: number, price: number };

  public get params() {
    return { numberOfCities: this.sellParams && this.sellParams.numberOfCities };
  }
}
