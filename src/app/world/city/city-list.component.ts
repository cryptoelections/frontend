import { Component, Input, OnInit } from '@angular/core';
import { City } from '../../models/city.model';
import { CityService } from '../../services/city.service';
import { Country } from '../../models/country.model';
import { CitySortOption } from './city-filter.component';

@Component({
  selector: 'app-city-list',
  templateUrl: 'city-list.component.html'
})
export class CityListComponent implements OnInit {
  public list: Array<City>;
  public query: string;
  private _cities: Array<City>;
  @Input() public countries: Array<Country>;

  public get cities() {
    return this._cities;
  }

  constructor(private cityService: CityService) {
  }

  public ngOnInit() {
    this.cityService.getList()
      .subscribe((list: Array<City>) => {
        this.list = list;
        this._cities = list;
      });
  }

  public getStatus(city: City) {
    const population = +city.population;
    if (population < 200000) {
      return 'smallCity'
    } else if (population >= 200000 && population < 1000000) {
      return 'mediumCity'
    }
    else {
      return 'bigCity'
    }
  }

  public getCountryName(city: City): string {
    return this.countries.find(_ => _.code === city.country).name;
  }

  public onSortByChange(sortByOption: CitySortOption) {
    console.log(sortByOption);
    let sort;
    switch (sortByOption) {
      case CitySortOption.Price: {
        sort = (a: City, b: City) => a.price < b.price ? -1 : 1;
        break;
      }
      case CitySortOption.Population: {
        sort = (a: City, b: City) => a.population < b.population ? -1 : 1;
        break;
      }
      case CitySortOption.Country: {
        sort = (a: City, b: City) => a.country.localeCompare(b.country);
        break;
      }
      default: {
        sort = (a: City, b: City) => a.name.localeCompare(b.name);
        break;
      }
    }

    this._cities = this._cities.sort(sort);
  }

  public onQueryChange(query?: string) {
    this.query = query;
    const upperQuery = query && query.toUpperCase();
    const queryFilter = (city: City) => !query
      || city.name.toUpperCase().indexOf(upperQuery) > -1
      || this.getCountryName(city).toUpperCase().indexOf(upperQuery) > -1;

    this._cities = this.list.filter(city => queryFilter(city))
  }
}
