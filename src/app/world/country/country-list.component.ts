import { Component, Input } from '@angular/core';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-country-list',
  templateUrl: 'country-list.component.html'
})
export class CountryListComponent {
  @Input() public countries: Array<Country>;

  public getFlag(country: Country) {
    return `background-image: url('http://www.geognos.com/api/en/countries/flag/${country.code}.png')`
  }
}
