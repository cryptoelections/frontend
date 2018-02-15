import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Country } from '../../models/country.model';
import { CountrySortOption } from '../../../world/country/country-filter.component';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { City } from '../../models/city.model';
import * as fromCities from '../city/city.reducers';
import * as actions from './country.actions';
import { CitySortOption } from '../../../world/city/city-filter.component';


export interface State extends EntityState<Country> {
  loading: boolean,
  filters: {
    sortBy: CountrySortOption,
    biggerFirst: boolean,
    query: string,
    page: number
  }
}

export interface CountryState {
  list: State
}

export const countryReducers = {
  list: reducer
};

export const adapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (item: Country) => item.code,
  sortComparer: (a: Country, b: Country) => a.name.localeCompare(b.name)
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    sortBy: CountrySortOption.Name,
    biggerFirst: false,
    query: '',
    page: 1
  }
});

export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.LOAD_COUNTRIES_REQUEST: {
      return { ...state, loading: true };
    }
    case actions.LOAD_COUNTRIES_RESPONSE: {
      return { ...adapter.addAll([...action.payload], state), loading: false };
    }
    case actions.FILTER_UPDATE: {
      return { ...state, filters: { ...state.filters, ...action.payload } };
    }
    default: {
      return { ...state };
    }
  }
}

export const getCountriesState = createFeatureSelector<CountryState>('countries');
export const getCountryEntityState = createSelector(
  getCountriesState,
  state => state.list
);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getCountryEntityState);
export const isLoading = createSelector(getCountryEntityState, state => state.loading);
export const page = createSelector(getCountryEntityState, state => +state.filters.page
);
export const filters = createSelector(getCountryEntityState, state => state.filters);
export const query = createSelector(filters, state => state.query);
export const sortBy = createSelector(filters, state => state.sortBy);
export const filteredCountries = createSelector(
  selectAll,
  filters,
  fromCities.citiesByCountriesEntities,
  (countries, filter, cityEntities) => {
    const upperQuery = filter.query && filter.query.toUpperCase();

    const sortByQuery = (country: Country) => !filter.query
      || country.name.toUpperCase().indexOf(upperQuery) > -1
      || country.code.toUpperCase().indexOf(upperQuery) > -1
      || cityEntities && cityEntities[country.code] && cityEntities[country.code]
        .find(city => city.name.toUpperCase().indexOf(upperQuery) > -1);

    const filteredList = countries.filter((country: Country) => sortByQuery(country));
    const sortedList = sortCountries(
      filteredList,
      cityEntities,
      +filter.sortBy as CountrySortOption
    );

    return sortedList;
  }
);

export const filteredCountriesLength = createSelector(
  filteredCountries,
  countries => countries && countries.length
);
export const countriesForPage = createSelector(filteredCountries, filters,
  (countries, filter) => countries.slice(filter.page * 8 - 8, filter.page * 8)
);

export const electorate = (cities: Array<City>): number => {
  let count = 0;
  cities && cities.forEach((city: City) => count += +city.population);
  return count;
};

export const price = (cities: Array<City>): { numberOfCities: number, price: number } => {
  const half = electorate(cities) / 2;
  let price = 0;
  let el = 0; // todo: add already bought cities electorate
  let numberOfCities = 0;
  cities && cities.sort((a: City, b: City) => {
    const pricePerElectorate = (city: City) => city.price / +city.population;
    return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
  })
    .forEach((city: City) => {
      while (el < half) {
        price += +city.price;
        numberOfCities++;
        el += +city.population;
      }
    });
  return { numberOfCities, price };
};

export const numberOfCities = (cities: Array<City>): number => cities ? cities.length : 0;

export const sortCountries = (
  countries: Array<Country>,
  citiesByCountries,
  sortByOption: CountrySortOption
) => {
  let sort;

  switch (sortByOption) {
    case CountrySortOption.PriceDown: {
      sort = (a: Country, b: Country) =>
        price(citiesByCountries[a.code]).price < price(citiesByCountries[b.code]).price
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.PriceUp: {
      sort = (a: Country, b: Country) =>
        price(citiesByCountries[a.code]).price > price(citiesByCountries[b.code]).price
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.ElectorateDown: {
      sort = (a: Country, b: Country) =>
        electorate(citiesByCountries[a.code]) < electorate(citiesByCountries[b.code])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.ElectorateUp: {
      sort = (a: Country, b: Country) =>
        electorate(citiesByCountries[a.code]) > electorate(citiesByCountries[b.code])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.NumberOfCitiesDown: {
      sort = (a: Country, b: Country) =>
        numberOfCities(citiesByCountries[a.code]) < numberOfCities(citiesByCountries[b.code])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.NumberOfCitiesUp: {
      sort = (a: Country, b: Country) =>
        numberOfCities(citiesByCountries[a.code]) > numberOfCities(citiesByCountries[b.code])
          ? -1
          : 1;
      break;
    }
    default: {
      sort = (a: Country, b: Country) => a.name.localeCompare(b.name);
      break;
    }
  }

  return countries && countries.sort(sort);
};

export const filteredCities = createSelector(
  fromCities.selectAll,
  fromCities.filters,
  selectEntities,
  (cities, filter, countries) => {
    const upperQuery = filter.query && filter.query.toUpperCase();
    const queryFilter = (city: City) => {
      const country = countries && countries[city.country] && countries[city.country].name;
      return !filter.query
        || city.name.toUpperCase().indexOf(upperQuery) > -1
        || country.toUpperCase().indexOf(upperQuery) > -1;
    };
    const filteredList = cities.filter((city: City) => queryFilter(city));
    const sortedList = sortCities(filteredList, +filter.sortBy);

    return sortedList;
  }
);

export const sortCities = (cities: Array<City>, sortByOption: CitySortOption) => {
  let sort;
  switch (sortByOption) {
    case CitySortOption.PriceDown: {
      sort = (a: City, b: City) => a.price < b.price ? -1 : 1;
      break;
    }
    case CitySortOption.PriceUp: {
      sort = (a: City, b: City) => a.price > b.price ? -1 : 1;
      break;
    }
    case CitySortOption.ElectorateDown: {
      sort = (a: City, b: City) => +a.population < +b.population ? -1 : 1;
      break;
    }
    case CitySortOption.ElectorateUp: {
      sort = (a: City, b: City) => +a.population > +b.population ? -1 : 1;
      break;
    }
    case CitySortOption.PricePerVoteDown: {
      sort = (a: City, b: City) => (
        a.price / +a.population
      ) < (
        b.price / +b.population
      ) ? -1 : 1;
      break;
    }
    case CitySortOption.PricePerVoteUp: {
      sort = (a: City, b: City) => (
        a.price / +a.population
      ) > (
        b.price / +b.population
      ) ? -1 : 1;
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

  return cities && cities.sort(sort);
};

export const filteredCitiesLength = createSelector(
  filteredCities,
  cities => cities && cities.length
);
export const citiesForPage = createSelector(filteredCities, fromCities.filters,
  (cities, filter) => cities.slice(filter.page * 8 - 8, filter.page * 8)
);

export const selectMostCostEffectiveCitiesForCountry = createSelector(
  fromCities.citiesByCountriesEntities,
  (citiesByCountries) => {
    return Object.entries(citiesByCountries).map(([key, value]) => {
      let countryElectorate = 0;
      let half = 0;
      let el = 0;
      let cities = 0;
      value
        .sort((
          a: City,
          b: City
        ) => (+a.population / +a.price) < (+b.population / +b.price) ? -1 : 1)
        .forEach((city: City) => {
          countryElectorate += +city.population;
          half = countryElectorate / 2;
          while (el < half) {
            el += +city.population;
            cities++;
          }
        });

      return {
        [key]: value ? value.splice(0, cities) : []
      };
    }).reduce((m, [key, value]) => ({ ...m, [key]: value }), {});
  }
);
