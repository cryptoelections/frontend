import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as actions from './nicknames.actions';

export interface State {
  entities: { [address: string]: string };
}

export interface MyCampaignState {
  list: State;
}

export const nicknamesReducer = {
  list: reducer
};

export const initialState: State = {
  entities: {}
};


export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.LOAD_NICKNAMES_RESPONSE: {
      return {entities: {...action.payload}};
    }
    default: {
      return {...state};
    }
  }
}

export const getNicknamesState = createFeatureSelector<MyCampaignState>('nicknames');
export const getNicknamesEntityState = createSelector(getNicknamesState, state => state.list);
export const selectEntities = createSelector(getNicknamesEntityState, state => state.entities);
