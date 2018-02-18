import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as actions from './my-campaign.actions';

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
