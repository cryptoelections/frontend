import {Action} from '@ngrx/store';
import {City} from '../../models/city.model';

export const LOAD_CITY_INFORMATION_REQUEST = '[CITY] LOAD_CITY_INFORMATION_REQUEST';
export const LOAD_DYNAMIC_CITY_INFORMATION_REQUEST = '[CITY] LOAD_DYNAMIC_CITY_INFORMATION_REQUEST';
export const LOAD_DYNAMIC_CITY_INFORMATION_RESPONSE = '[CITY] LOAD_DYNAMIC_CITY_INFORMATION_RESPONSE';
export const LOAD_CITY_INFORMATION_RESPONSE = '[CITY] LOAD_CITY_INFORMATION_RESPONSE';
export const FILTER_UPDATE = '[CITY] FILTER_UPDATE';
export const LOAD_SELECTED_CITY = '[CITY] LOAD_SELECTED_CITY';
export const INVEST = '[CITY] INVEST';
export const INVEST_SUCCESS = '[CITY] INVEST_SUCCESS';
export const INVEST_ERROR = '[CITY] INVEST_ERROR';

export class LoadCityInformationRequest implements Action {
  type = LOAD_CITY_INFORMATION_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadDynamicCityInformationRequest implements Action {
  type = LOAD_DYNAMIC_CITY_INFORMATION_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadDynamicCityInformationResponse implements Action {
  type = LOAD_DYNAMIC_CITY_INFORMATION_RESPONSE;

  constructor(public payload: {[id: string]: Partial<City>}) {
  }
}

export class LoadCityInformationResponse implements Action {
  type = LOAD_CITY_INFORMATION_RESPONSE;

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

export class Invest implements Action {
  type = INVEST;

  constructor(public payload: {id: string, price?: number | string}) {
  }
}


export class InvestSuccess implements Action {
  type = INVEST_SUCCESS;

  constructor(public payload: string) {
  }
}


export class InvestError implements Action {
  type = INVEST_ERROR;

  constructor(public payload?: string) {
  }
}


export type Actions = LoadCityInformationRequest
  | LoadCityInformationResponse
  | LoadDynamicCityInformationRequest
  | LoadDynamicCityInformationResponse
  | FilterUpdate
  | LoadSelectedCity
  | Invest
  | InvestSuccess
  | InvestError;
