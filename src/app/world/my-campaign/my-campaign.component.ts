import {Component, EventEmitter, Input, Output} from '@angular/core';
import {City} from '../../shared/models/city.model';

@Component({
  selector: 'app-my-campaign',
  templateUrl: './my-campaign.component.html'
})
export class MyCampaignComponent {
  @Input() public countries;
  @Input() public cities;
  @Input() public myCities: Array<City>;
  @Input() public query: string;
  @Input() public page: number;
  @Input() public total: number;
  @Input() public dynamic;
  @Input() public isLoading: boolean;
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public pageChange = new EventEmitter<number>();

  public get myCountries() {
    return this.myCities && this.myCities.map((c: City) => c && c.country)
      .filter((elem, index, self) => index === self.indexOf(elem));
  }

  public get myCitiesByCountry() {
    return this.myCities && this.myCities.reduce((m, i) => (
      {
        ...m,
        [i && i.country]: (
          m[i && i.country] ? [...m[i && i.country], i] : [i]
        )
      }
    ), {});
  }

  public percentageByCountry(country: string) {
    let sum = 0;
    this.myCitiesByCountry[country].forEach((city: City) => sum += +this.percentage(city).percentage);
    return sum;
  }

  public percentage(city: City): { percentage: string } {
    let count = 0;
    if (this.cities && this.cities[city && city.country]) {
      this.cities[city && city.country].forEach((c: City) => count += +c.population);
    }
    const percentage = (
      (
        100 * (city && +city.population)
      ) / count
    ).toFixed(2);
    return {percentage};
  }

  public price(country): { price: number } {
    const half = this.electorate(country) / 2;
    let price = 0;
    let electorate = this.electorate(country);
    this.myCitiesByCountry[country]
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) => this.dynamic[city.id] && +this.dynamic[city.id].price / +city.population;
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .forEach((city: City) => {
        while (electorate < half) {
          price += this.dynamic[city.id] && +this.dynamic[city.id].price;
          electorate += +city.population;
        }
      });
    return {price: price || 0};
  }

  public electorate(country): number {
    let count = 0;
    if (this.myCitiesByCountry && this.myCitiesByCountry[country] && this.myCitiesByCountry[country].length) {
      this.myCitiesByCountry[country].forEach((city: City) => count += +city.population);
    }
    return count;
  }
}
