import { Action } from '@ngrx/store'
import { City } from '../../models/city.model';

export const LOAD_CITIES_REQUEST = '[CITY] LOAD_CITIES_REQUEST';
export const LOAD_CITIES_RESPONSE = '[CITY] LOAD_CITIES_RESPONSE';
export const FILTER_UPDATE = '[CITY] FILTER_UPDATE';
export const LOAD_SELECTED_CITY = '[CITY] LOAD_SELECTED_CITY';

export class LoadCitiesRequest implements Action {
  type = LOAD_CITIES_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadCitiesResponse implements Action {
  type = LOAD_CITIES_RESPONSE;

  constructor(public payload: Array<City>) {
  }
}

export class FilterUpdate implements Action {
  type = FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class LoadSelectedCity implements Action {
  type = LOAD_SELECTED_CITY;

  constructor(public payload: string) {
  }
}

export type Actions = LoadCitiesResponse
  | LoadCitiesRequest
  | FilterUpdate
  | LoadSelectedCity;
