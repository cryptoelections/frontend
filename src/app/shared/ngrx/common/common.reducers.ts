import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as actions from './common.actions';

export interface CommonState {
  errors: Array<any>;
}

export const initialState: CommonState = {errors: []};

export function commonReducers(state = initialState, action: actions.Actions): CommonState {
  switch (action.type) {
    case actions.SHOW_ERROR: {
      const error = {
        type: 'danger',
        msg: {
          text: 'COMMON.UNSUCCESSFUL_TRANSACTION',
          params: {name: action.payload.name}
        },
        timeout: 5000
      };

      return {...state, errors: [error]};
    }
    default: {
      return {...state};
    }
  }
}

export const getCommonState = createFeatureSelector<CommonState>('common');
export const getErrors = createSelector(getCommonState, state => state.errors);
