import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CitySortOption} from '../../../world/city/city-filter.component';
import {City} from '../../models/city.model';
import * as actions from './city.actions';
import * as common from '../common/common.actions';
import {StorageKeys} from '../../services/storage.service';

export interface DynamicState {
  loading: boolean;
  entities: { [id: string]: Partial<City> };
}

export interface State extends EntityState<City> {
  loading: boolean;
  citiesByCountry: any;
  selectedCity: string;
  filters: {
    sortBy: CitySortOption,
    biggerFirst: boolean,
    query: string,
    page: number
  };
  dynamic: DynamicState;
}

export interface CityState {
  list: State;
}

export const cityReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<City> = createEntityAdapter<City>({
  selectId: (item: City) => item && item.id,
  sortComparer: (a: City, b: City) => a.name.localeCompare(b.name)
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedCity: '',
  citiesByCountry: {},
  filters: {
    sortBy: CitySortOption.Name,
    biggerFirst: false,
    query: '',
    page: 1
  },
  dynamic: {
    entities: {},
    loading: false
  }
});

export function reducer(state = initialState, action: actions.Actions | common.Actions): State {
  switch (action.type) {
    case actions.LOAD_CITY_INFORMATION_REQUEST: {
      return {...state, loading: true};
    }
    case actions.LOAD_CITY_INFORMATION_RESPONSE: {
      const reduceByCountry = action.payload.reduce((m, i) => (
        {
          ...m,
          [i.country_id]: (
            m[i.country_id] ? [...m[i.country_id], i.id] : [i.id]
          )
        }
      ), {});

      const newState = {
        ...state,
        loading: false,
        citiesByCountry: reduceByCountry
      };

      return {...adapter.addAll(action.payload, newState)};
    }
    case actions.FILTER_UPDATE: {
      return {...state, filters: {...state.filters, ...action.payload}};
    }
    case actions.LOAD_SELECTED_CITY: {
      return {...state, selectedCity: action.payload};
    }
    case actions.LOAD_DYNAMIC_CITY_INFORMATION_REQUEST: {
      return {...state, dynamic: {...state.dynamic, loading: true}};
    }
    case actions.LOAD_DYNAMIC_CITY_INFORMATION_RESPONSE: {
      return {...state, dynamic: {entities: {...action.payload}, loading: false}};
    }
    case actions.INVEST: {
      const buyingCity = {...state.entities[action.payload.id], buying: true};
      return {...adapter.updateOne({id: action.payload.id, changes: buyingCity}, state)};
    }
    case common.SHOW_ERROR: {
      const buyingCity = {...action.payload, buying: false};
      return {...adapter.updateOne({id: action.payload.id, changes: buyingCity}, state)};
    }
    case actions.INVEST_SUCCESS: {
      const buyingCity = {
        ...action.payload,
        buying: false,
        dynamic: {
          ...state.dynamic,
          [action.payload.id]:
            {
              ...state.dynamic[action.payload.id],
              mayor: JSON.parse(localStorage.getItem(StorageKeys.Account)).address
            }
        }
      };
      return {...adapter.updateOne({id: action.payload.id, changes: buyingCity}, state)};
    }
    default: {
      return {...state};
    }
  }
}

export const getCitiesState = createFeatureSelector<CityState>('cities');
export const getCityEntityState = createSelector(getCitiesState, state => state.list);
export const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors(
  getCityEntityState);

export const isLoading = createSelector(getCityEntityState, state => state.loading);
export const page = createSelector(getCityEntityState, state => +state.filters.page);
export const filters = createSelector(getCityEntityState, state => state.filters);
export const query = createSelector(filters, state => state.query);
export const sortBy = createSelector(filters, state => state.sortBy);
export const citiesByCountry = createSelector(
  getCityEntityState,
  state => state.citiesByCountry
);
export const getSelectedCity = createSelector(
  getCityEntityState,
  state => selectEntities &&
    selectEntities[state.selectedCity]
);

export const getDynamicCitiesState = createSelector(getCitiesState, state => state.list.dynamic);
export const getDynamicInfoEntities = createSelector(getDynamicCitiesState, state => state.entities);
export const isDynamicLoading = createSelector(getDynamicCitiesState, state => state.loading);
