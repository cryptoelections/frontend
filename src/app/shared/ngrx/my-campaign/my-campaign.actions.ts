import { Action } from '@ngrx/store'

export const LOAD_MY_CITIES_REQUEST = '[MY_CAMPAIGN] LOAD_MY_CITIES_REQUEST';
export const LOAD_MY_CITIES_RESPONSE = '[MY_CAMPAIGN] LOAD_MY_CITIES_RESPONSE';

export class LoadMyCitiesRequest implements Action {
  type = LOAD_MY_CITIES_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadMyCitiesResponse implements Action {
  type = LOAD_MY_CITIES_RESPONSE;

  constructor(public payload: Array<string>) {
  }
}

export type Actions = LoadMyCitiesRequest | LoadMyCitiesResponse;
