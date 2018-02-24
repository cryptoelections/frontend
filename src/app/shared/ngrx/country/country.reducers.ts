import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Country} from '../../models/country.model';
import {CountrySortOption} from '../../../world/country/country-filter.component';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {City} from '../../models/city.model';
import {CitySortOption} from '../../../world/city/city-filter.component';
import {DEFAULT_PRICE} from '../../services/base.service';

import * as fromMyCampaign from '../my-campaign/my-campaign.reducers';
import * as fromCities from '../city/city.reducers';
import * as actions from './country.actions';


export interface State extends EntityState<Country> {
  loading: boolean;
  filters: {
    sortBy: CountrySortOption,
    biggerFirst: boolean,
    query: string,
    page: number
  };
  dynamic: {
    loading: boolean;
    entities: { [id: string]: Partial<Country> }
  };
}

export interface CountryState {
  list: State;
}

export const countryReducers = {
  list: reducer
};

export const adapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (item: Country) => item.id,
  sortComparer: (a: Country, b: Country) => a.name.localeCompare(b.name)
});

export const dynamicAdapter = createEntityAdapter<Partial<Country>>({
  selectId: (item: Country) => item.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    sortBy: CountrySortOption.Name,
    biggerFirst: false,
    query: '',
    page: 1
  },
  dynamic: {
    loading: false,
    entities: {}
  }
});

export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.LOAD_COUNTRIES_REQUEST: {
      return {...state, loading: true};
    }
    case actions.LOAD_COUNTRIES_RESPONSE: {
      return {
        ...adapter.addAll(action.payload && action.payload.length ? action.payload : [],
          state), loading: false
      };
    }
    case actions.FILTER_UPDATE: {
      return {...state, filters: {...state.filters, ...action.payload}};
    }
    case actions.LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST: {
      return {...state, dynamic: {...state.dynamic, loading: true}};
    }
    case actions.LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE: {
      return {...state, dynamic: {entities: {...action.payload}, loading: false}};
    }
    default: {
      return {...state};
    }
  }
}

export const getCountriesState = createFeatureSelector<CountryState>('countries');
export const getCountryEntityState = createSelector(
  getCountriesState,
  state => state.list
);
export const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors(
  getCountryEntityState);
export const isLoading = createSelector(getCountryEntityState, state => state.loading);
export const page = createSelector(getCountryEntityState, state => +state.filters.page
);
export const filters = createSelector(getCountryEntityState, state => state.filters);
export const query = createSelector(filters, state => state.query);
export const sortBy = createSelector(filters, state => state.sortBy);


export const citiesByCountriesEntities = createSelector(fromCities.citiesByCountry, fromCities.selectEntities,
  (citiesByCountries, cities) => {
    return Object.entries(citiesByCountries).reduce((m, [key, value]) => (
      {...m, [key]: value ? value.map((cityId: string) => cities[cityId]) : []}
    ), {});
  }
);

// My campaign
export const selectCountryEntities = createSelector(selectEntities, state => state);

export const selectFilteredList = createSelector(citiesByCountriesEntities,
  fromCities.selectEntities, selectCountryEntities, fromMyCampaign.selectAll, fromMyCampaign.filters,
  (citiesByCountries, cityEntities, countryEntities, myCities, filter) => {
    const lowerQuery = filter.query && filter.query.toLowerCase();
    const filterByQuery = (city: City) => !filter.query
      || city.name.toLowerCase().indexOf(lowerQuery) > -1
      || countryEntities[city.country_id].name.toLowerCase().indexOf(lowerQuery) > -1;

    return myCities.map((id: string) => cityEntities[id]).filter((city: City) => filterByQuery(city));
  });

export const selectAllByCountries = createSelector(fromMyCampaign.selectAll, fromCities.selectEntities, (myCities, cityEntities) => {
  return myCities
    .map((id: string) => cityEntities[id])
    .reduce((m, i) => ({
      ...m, [i.country_id]: (
        m[i.country_id] ? [...m[i.country_id], i] : [i]
      )
    }), {});
});

export const filteredListCountries = createSelector(selectFilteredList, (myCities) => {
  let numberCitiesForPage = 0;
  const myCountries = [];

  if (myCities) {
    myCities.forEach(city => {
      if (myCountries && myCountries.indexOf(city && city.country_id) === -1) {
        myCountries.push(city && city.country_id);
      }
      numberCitiesForPage++;
    });
  }
  return myCountries.sort((a, b) => a < b ? -1 : 1);
});

export const filteredListCountriesTotal = createSelector(filteredListCountries, list => list && list.length);
export const filteredListForPage = createSelector(selectFilteredList, filteredListCountries, fromMyCampaign.page,
  (myCities, countries, p) => {
    const sortedList = myCities.sort((city: City, city2: City) => city.country_id < city2.country_id ? -1 : 1);
    const first = sortedList.findIndex((city: City) => city && city.country_id === countries[p * 4 - 4]);
    const last = sortedList.findIndex((city: City) => city && city.country_id === countries[p * 4 + 1]);
    return last < 0 ? sortedList : sortedList.splice(first, last);
  });

/* ----- my campaign end ------- */

export const filteredCountries = createSelector(
  selectAll,
  filters,
  citiesByCountriesEntities,
  selectAllByCountries,
  fromCities.getDynamicCitiesState,
  (countries, filter, cityEntities, myCityEntities, dynamicCities) => {
    const upperQuery = filter.query && filter.query.toUpperCase();

    const sortByQuery = (country: Country) => !filter.query
      || country.name && country.name.toUpperCase().indexOf(upperQuery) > -1
      || country.code && country.code.toUpperCase().indexOf(upperQuery) > -1
      || cityEntities && cityEntities[country.id] && cityEntities[country.id]
        .find(city => city.name.toUpperCase().indexOf(upperQuery) > -1);

    const filteredList = countries.filter((country: Country) => sortByQuery(country)
      && cityEntities[country.id]
      && cityEntities[country.id].length);
    const sortedList = sortCountries(
      filteredList,
      cityEntities,
      myCityEntities,
      +filter.sortBy as CountrySortOption,
      dynamicCities.entities
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
  if (cities) {
    cities.forEach((city: City) => count += +city.population);
  }
  return count;
};

export const price = (cities: Array<City>, myCities: Array<City>, dynamicCityInfo) => {
  const half = electorate(cities) / 2;
  let p = 0;
  let el = 0;

  if (myCities && myCities.length) {
    myCities.forEach(city => el += +city.population);
  }

  let n = 0;
  if (cities) {
    cities
      .filter((city) => !myCities || !myCities.find(c => c.id === city.id))
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) =>
          (dynamicCityInfo[city.id] && +dynamicCityInfo[city.id].price || DEFAULT_PRICE) / +city.population;
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .forEach((city: City) => {
        while (el < half) {
          p += dynamicCityInfo[city.id] && +dynamicCityInfo[city.id].price || +DEFAULT_PRICE;
          n++;
          el += +city.population;
        }
      });
  }
  return p;
};

export const numberOfCities = (cities: Array<City>): number => cities ? cities.length : 0;

export const sortCountries = (countries: Array<Country>,
                              citiesByCountries,
                              myCitiesByCountries,
                              sortByOption: CountrySortOption,
                              dynamicCities) => {
  let sort;

  switch (sortByOption) {
    case CountrySortOption.Availability: {
      sort = (a: Country, b: Country) => a.active === b.active ? 0 : (a.active && !b.active ? -1 : (!a.active && b.active) ? 1 : -1);
      break;
    }
    case CountrySortOption.PriceDown: {
      sort = (a: Country, b: Country) =>
        price(citiesByCountries[a.id],
          myCitiesByCountries[a.id],
          dynamicCities) < price(citiesByCountries[b.id], myCitiesByCountries[b.id], dynamicCities)
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.PriceUp: {
      sort = (a: Country, b: Country) =>
        price(citiesByCountries[a.id],
          myCitiesByCountries[a.id],
          dynamicCities) > price(citiesByCountries[b.id], myCitiesByCountries[b.id], dynamicCities)
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.ElectorateDown: {
      sort = (a: Country, b: Country) =>
        electorate(citiesByCountries[a.id]) < electorate(citiesByCountries[b.id])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.ElectorateUp: {
      sort = (a: Country, b: Country) =>
        electorate(citiesByCountries[a.id]) > electorate(citiesByCountries[b.id])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.NumberOfCitiesDown: {
      sort = (a: Country, b: Country) =>
        numberOfCities(citiesByCountries[a.id]) < numberOfCities(citiesByCountries[b.id])
          ? -1
          : 1;
      break;
    }
    case CountrySortOption.NumberOfCitiesUp: {
      sort = (a: Country, b: Country) =>
        numberOfCities(citiesByCountries[a.id]) > numberOfCities(citiesByCountries[b.id])
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
    const active = (city: City) => countries && countries[city.country_id]
      && countries[city.country_id] && countries[city.country_id].active;

    const queryFilter = (city: City) => {
      const country = countries && countries[city.country_id] && countries[city.country_id];
      return !filter.query
        || city.name && city.name.toUpperCase().indexOf(upperQuery) > -1
        || country && country.name && country.name.toUpperCase().indexOf(upperQuery) > -1;
    };
    const filteredList = cities.filter((city: City) => queryFilter(city) && active(city));
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
export const getDynamicCountriesState = createSelector(getCountriesState, state => state.list.dynamic);
export const getDynamicInfoEntities = createSelector(getDynamicCountriesState, state => state.entities);
export const isDynamicLoading = createSelector(getDynamicCountriesState, state => state.loading);
