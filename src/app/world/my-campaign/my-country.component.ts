import { Component, Input } from '@angular/core';
import { Country } from '../../shared/models/country.model';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-my-country',
  template: `
    <accordion-group #group>
      <div accordion-heading class="row my-country-header">
        <div class="my-country-image">
          <img [src]="'assets/images/country-flags/large/'+country.code.toLowerCase() +'.png'" alt=""/>
        </div>
        <h2 class="col-md-4 col-xs-12">{{ country.name }}</h2>
        <div class="col-md-4 col-xs-12">
          <progressbar max="100" [value]="percentage" type="primary"
                       [striped]="true" [animate]="true">
            <i>{{ percentage }}%</i></progressbar>
        </div>
        <div class="col-md-2 col-xs-12 text-right">
          <button class="btn card-button country-button" *ngIf="(+percentage) < 50">
            <div class="btn-left">
              <span>{{ 'COUNTRY.CARD.BUY_FOR' | translate:params }}</span><br/>
              {{'COUNTRY.CARD.TO_WIN' | translate }}
            </div>
            <div class="btn-right"><b>{{ sellParams.price }}</b><br/> ETH</div>
          </button>
          <button class="btn btn-default">
            <i class="fas" [ngClass]="group.isOpen ? 'fa-angle-up' : 'fa-angle-down'"></i>
          </button>
        </div>
      </div>
      <ng-container *ngFor="let city of citiesOfCountry">
        <app-my-city [city]="city"
                     [cities]="citiesOfCountry"></app-my-city>
      </ng-container>
    </accordion-group>
  `
})
export class MyCountryComponent {
  @Input() public country: Country;
  @Input() public citiesOfCountry: Array<City>;
  @Input() public percentage: number | string;
  @Input() public sellParams: { numberOfCities: number, price: number };

  public get params() {
    return { numberOfCities: this.sellParams && this.sellParams.numberOfCities }
  }
}
