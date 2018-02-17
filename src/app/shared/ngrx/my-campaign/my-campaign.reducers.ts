import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {City} from '../../models/city.model';
import * as actions from './my-campaign.actions';
import * as fromCities from '../city/city.reducers';
import * as fromCountries from '../country/country.reducers';

export interface State extends EntityState<string> {
  loading: boolean;
  filters: {
    page: number
    query: string
  };
}

export interface MyCampaignState {
  list: State;
}

export const myCampaignReducers = {
  list: reducer
};

export const adapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: (item: string) => item,
  sortComparer: (a: string, b: string) => a.localeCompare(b)
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    query: '',
    page: 1
  }
});


export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.LOAD_MY_CITIES_REQUEST: {
      return {...state, loading: true};
    }
    case actions.LOAD_MY_CITIES_RESPONSE: {
      return {...adapter.addAll(action.payload && [...action.payload], state), loading: false};
    }
    case actions.ADD_MY_CITY: {
      return {...adapter.addOne(action.payload, state)};
    }
    case actions.NO_CITIES_MORE: {
      return {...state, loading: false};
    }
    case actions.FILTER_UPDATE: {
      return {...state, filters: {...state.filters, ...action.payload}};
    }
    default: {
      return {...state};
    }
  }
}

export const getMyCampaignState = createFeatureSelector<MyCampaignState>('myCampaign');
export const getMyCampaignEntityState = createSelector(getMyCampaignState, state => state.list);
export const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors(getMyCampaignEntityState);
export const isLoading = createSelector(getMyCampaignEntityState, state => state.loading);
export const filters = createSelector(getMyCampaignEntityState, state => state.filters);
export const query = createSelector(filters, state => state.query);
export const page = createSelector(filters, state => +state.page);
export const selectFilteredList = createSelector(fromCities.citiesByCountriesEntities,
  fromCities.selectEntities, fromCountries.selectEntities, selectAll, filters,
  (citiesByCountries, cityEntities, countryEntities, myCities, filter) => {
    const lowerQuery = filter.query && filter.query.toLowerCase();
    const filterByQuery = (city: City) => !filter.query
      || city.name.toLowerCase().indexOf(lowerQuery) > -1
      || countryEntities[city.country].name.toLowerCase().indexOf(lowerQuery) > -1;

    return myCities.map((id: string) => cityEntities[id]).filter((city: City) => filterByQuery(city));
  });

export const selectAllByCountries = createSelector(selectAll, fromCities.selectEntities, (myCities, cityEntities) => {
  return myCities.map((id: string) => cityEntities[id]).reduce((m, i) => ({
    ...m, [i.country]: (
      m[i.country] ? [...m[i.country], i] : [i]
    )
  }), {});
});

export const filteredListCountries = createSelector(selectFilteredList, (myCities) => {
  let numberCitiesForPage = 0;
  const myCountries = [];

  myCities.forEach(city => {
    if (myCountries.indexOf(city && city.country) === -1) {
      myCountries.push(city && city.country);
    }
    numberCitiesForPage++;
  });
  return myCountries;
});

export const filteredListCountriesTotal = createSelector(filteredListCountries, list => list && list.length);
export const filteredListForPage = createSelector(selectFilteredList, filteredListCountries, page, (myCities, countries, p) => {
  const sortedList = myCities.sort((city: City, city2: City) => city.country < city2.country ? -1 : 1);

  const first = sortedList.findIndex((city: City) => city && city.country === countries[p * 4 - 4]);
  const last = sortedList.findIndex((city: City) => city && city.country === countries[p * countries.length]);
  return sortedList.splice(first, (last < 0 ? countries.length : last));
});
