import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { City } from '../../models/city.model';
import * as actions from './my-campaign.actions';
import * as fromCities from '../city/city.reducers';
import * as fromCountries from '../country/country.reducers';

export interface State extends EntityState<string> {
  loading: boolean,
  filters: {
    query: string
  }
}

export interface MyCampaignState {
  list: State
}

export const myCampaignReducers = {
  list: reducer
}

export const adapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: (item: string) => item,
  sortComparer: (a: string, b: string) => a.localeCompare(b)
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    query: '',
  }
});


export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.LOAD_MY_CITIES_REQUEST: {
      return { ...state, loading: true };
    }
    case actions.LOAD_MY_CITIES_RESPONSE: {
      return { ...adapter.addAll([...action.payload], state), loading: false };
    }
    default: {
      return { ...state };
    }
  }
}

export const getMyCampaignState = createFeatureSelector<MyCampaignState>('myCampaign');
export const getMyCampaignEntityState = createSelector(getMyCampaignState, state => state.list);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(getMyCampaignEntityState);
export const isLoading = createSelector(getMyCampaignEntityState, state => state.loading);
export const filters = createSelector(getMyCampaignEntityState, state => state.filters);
export const query = createSelector(filters, state => state.query);
export const selectFilteredList = createSelector(fromCities.citiesByCountriesEntities,
  fromCities.selectEntities, fromCountries.selectEntities, selectAll, filters,
  (citiesByCountries, cityEntities, countryEntities, myCities, filter) => {
    const lowerQuery = filter.query && filter.query.toLowerCase();
    const filterByQuery = (city: City) => !filter.query
      || city.name.toLowerCase().indexOf(lowerQuery) > -1
      || countryEntities[city.country].name.toLowerCase().indexOf(lowerQuery) > -1;

    return myCities.map((id: string) => cityEntities[id]).filter((city: City) => filterByQuery(city));
  });
