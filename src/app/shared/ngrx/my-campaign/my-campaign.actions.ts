import {Action} from '@ngrx/store';

export const LOAD_MY_CITIES_REQUEST = '[MY_CAMPAIGN] LOAD_MY_CITIES_REQUEST';
export const LOAD_MY_CITIES_RESPONSE = '[MY_CAMPAIGN] LOAD_MY_CITIES_RESPONSE';
export const FILTER_UPDATE = '[MY_CAMPAIGN] FILTER_UPDATE';
export const ADD_MY_CITY = '[MY_CAMPAIGN] ADD_MY_CITY';
export const NO_CITIES_MORE = '[MY_CAMPAIGN] NO_CITIES_MORE';

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

export class FilterUpdate implements Action {
  type = FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class AddMyCity implements Action {
  type = ADD_MY_CITY;

  constructor(public payload: string) {
  }
}

export class AddNoMoreCities implements Action {
  type = NO_CITIES_MORE;

  constructor(public payload?: string) {
  }
}

export type Actions = LoadMyCitiesRequest | LoadMyCitiesResponse | FilterUpdate | AddMyCity | AddNoMoreCities;
