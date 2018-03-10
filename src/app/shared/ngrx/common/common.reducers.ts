import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as actions from './common.actions';

export interface CommonState {
  errors: Array<any>;
  wallet: any;
  walletLoading: boolean;
}

export const initialState: CommonState = {errors: [], wallet: null, walletLoading: false};

export function commonReducers(state = initialState, action: actions.Actions): CommonState {
  switch (action.type) {
    case actions.SHOW_ERROR: {
      const error = {
        type: 'danger',
        msg: {
          text: 'ERRORS.UNSUCCESSFUL_TRANSACTION',
          params: {name: action.payload.name}
        },
        timeout: 5000
      };

      return {...state, errors: [error]};
    }
    case actions.LOAD_WALLET_DATA_REQUEST: {
      return {...state, walletLoading: true};
    }
    case actions.LOAD_WALLET_DATA_RESPONSE: {
      return {...state, wallet: action.payload, walletLoading: false};
    }
    case actions.WITHDRAW_REQUEST: {
      return {...state, walletLoading: true};
    }
    case actions.WITHDRAW_SUCCESS: {
      return {...state, wallet: 0.0000, walletLoading: false};
    }
    case actions.WITHDRAW_ERROR: {
      return {...state, walletLoading: false};
    }
    default: {
      return {...state};
    }
  }
}

export const getCommonState = createFeatureSelector<CommonState>('common');
export const getErrors = createSelector(getCommonState, state => state.errors);
export const getWallet = createSelector(getCommonState, state => state.wallet);
export const walletIsLoading = createSelector(getCommonState, state => state.walletLoading);
