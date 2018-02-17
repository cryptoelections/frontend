import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { Params } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export interface State {
  // layout: fromLayout.State;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  // layout: fromLayout.reducer,
  routerReducer: fromRouter.routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

// clear store if user logs out
export function logout(reducer: ActionReducer<State>) {
  return function (state: State, action: any): State {
    if (action.type === '[USER ACCOUNT] LOG_OUT_USER_ACCOUNT') {
      state = undefined;
    }

    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<State>[] = [logger, logout];
