import { Component, Input } from '@angular/core';
import { City } from '../../../shared/models/city.model';

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html'
})
export class CityDetailsComponent {
  @Input() public city: City;
}
