import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Country} from '../models/country.model';

@Component({
  selector: 'app-country-modal',
  template: `
    <div class="modal-body city-modal">
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <i aria-hidden="true" class="fas fa-times"></i>
      </button>
      <div class="container">
        <div class="modal-container p-3">
          <div class="city-modal-content p-5">
            <h2 [innerHTML]="'COUNTRY.MODAL.CONGRATULATIONS' | translate:params"></h2>
            <h1>{{ electorate }}%</h1>
            <button class="btn card-button mt-5" (click)="ruleCountry.emit()">
              {{ 'COUNTRY.MODAL.RULE_COUNTRY' | translate }}
            </button>
          </div>
        </div>
        <div class="modal-image-container">
          <img src="/assets/images/president-full.png" alt=""/>
          <img class="flag-modal" [src]="imageLink" alt=""/>
        </div>
      </div>
    </div>
  `
})

export class CountryModalComponent implements OnChanges {
  @Input() public countries: { [code: string]: Country };
  @Input() public countryId: number;
  @Input() public bsModalRef: BsModalRef;
  @Input() public cities: { [code: string]: Array<any> };
  @Input() public myCities: { [code: string]: Array<any> };
  @Output() public ruleCountry = new EventEmitter();
  public electorate: string;
  public countryCode: string;
  public params: object;
  public imageLink: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.cities || changes.myCities) {
      this.electorate = this.countElectorate();
    }

    if (changes.countries) {
      this.countryCode = this.countries && this.countries[this.countryId] && this.countries[this.countryId].code;
      this.params = {name: this.countries && this.countries[this.countryId] && this.countries[this.countryId].name};
      this.imageLink = `assets/images/country-flags/large/${this.countryCode && this.countryCode.toLowerCase()}.png`;
    }
  }

  private countElectorate(): string {
    let allElectorate = 0;
    if (this.cities && this.cities[this.countryCode] && this.cities[this.countryCode].length) {
      this.cities[this.countryCode].forEach((city) => allElectorate += +city.population);
    }

    let myElectorate = 0;
    if (this.myCities && this.myCities[this.countryCode] && this.myCities[this.countryCode].length) {
      this.myCities[this.countryCode].forEach((city) => myElectorate += +city.population);
    }
    return (myElectorate * 100 / allElectorate).toFixed(0);
  }
}
