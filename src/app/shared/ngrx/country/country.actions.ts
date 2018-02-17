import {Action} from '@ngrx/store';
import {Country} from '../../models/country.model';

export const LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST = '[COUNTRY] LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST';
export const LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE = '[COUNTRY] LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE';
export const LOAD_COUNTRIES_REQUEST = '[COUNTRY] LOAD_COUNTRIES_REQUEST';
export const LOAD_COUNTRIES_RESPONSE = '[COUNTRY] LOAD_COUNTRIES_RESPONSE';
export const FILTER_UPDATE = '[COUNTRY] FILTER_UPDATE';

export class LoadCountriesRequest implements Action {
  type = LOAD_COUNTRIES_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadCountriesResponse implements Action {
  type = LOAD_COUNTRIES_RESPONSE;

  constructor(public payload: Array<Country>) {
  }
}


export class LoadDynamicCountryInformationRequest implements Action {
  type = LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadDynamicCountryInformationResponse implements Action {
  type = LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE;

  constructor(public payload: any) {
  }
}


export class FilterUpdate implements Action {
  type = FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadCountriesResponse
  | LoadCountriesRequest
  | FilterUpdate
  | LoadDynamicCountryInformationRequest
  | LoadDynamicCountryInformationResponse;
