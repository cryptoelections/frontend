import { Component, Input } from '@angular/core';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-my-campaign',
  templateUrl: './my-campaign.component.html'
})
export class MyCampaignComponent {
  @Input() countries;
  @Input() cities;
  @Input() myCities: Array<City>;

  public get myCountries() {
    return this.myCities.map((c: City) => c.country)
      .filter((elem, index, self) => index === self.indexOf(elem));
  }

  public get myCitiesByCountry() {
    return this.myCities.reduce((m, i) => (
      {
        ...m,
        [i.country]: (
          m[i.country] ? [...m[i.country], i] : [i]
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
    this.cities[city.country]
      .forEach((c: City) => count += +c.population);
    const percentage = (
      (
        100 * +city.population
      ) / count
    ).toFixed(2);
    return { percentage };
  }

  public price(country): { numberOfCities: number, price: number } {
    const half = this.electorate(country) / 2;
    let price = 0;
    let electorate = 0; // todo: add already bought cities electorate
    let numberOfCities = 0;
    this.myCitiesByCountry[country]
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) => city.price / +city.population;
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .forEach((city: City) => {
        while (electorate < half) {
          price += +city.price;
          numberOfCities++;
          electorate += +city.population;
        }
      });
    return { numberOfCities, price };
  }

  public electorate(country): number {
    let count = 0;
    this.myCitiesByCountry[country].forEach((city: City) => count += +city.population)
    return count;
  }
}
