import {Action} from '@ngrx/store';
import {Country} from '../../models/country.model';
import {CitySortOption} from '../../../world/city/city-filter.component';

export const LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST = '[COUNTRY] LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST';
export const LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE = '[COUNTRY] LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE';
export const LOAD_LOCAL_DYNAMIC_COUNTRY_INFO_REQUEST = '[COUNTRY] LOAD_LOCAL_DYNAMIC_COUNTRY_INFO_REQUEST';

export const LOAD_COUNTRIES_REQUEST = '[COUNTRY] LOAD_COUNTRIES_REQUEST';
export const LOAD_COUNTRIES_RESPONSE = '[COUNTRY] LOAD_COUNTRIES_RESPONSE';
export const FILTER_UPDATE = '[COUNTRY] FILTER_UPDATE';
export const SELECT_COUNTRY = '[COUNTRY] SELECT_COUNTRY';
export const FILTER_SELECTED_COUNTRY_CITIES = '[COUNTRY] FILTER_SELECTED_COUNTRY_CITIES';

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

  constructor(public payload?: string[]) {
  }
}

export class LoadLocalDynamicCountryInformationRequest implements Action {
  type = LOAD_LOCAL_DYNAMIC_COUNTRY_INFO_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadDynamicCountryInformationResponse implements Action {
  type = LOAD_DYNAMIC_COUNTRY_INFORMATION_RESPONSE;

  constructor(public payload: { [id: string]: Partial<Country> }) {
  }
}


export class FilterUpdate implements Action {
  type = FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class SelectCountry implements Action {
  type = SELECT_COUNTRY;

  constructor(public payload: any) {
  }
}

export class FilterSelectedCountryCities implements Action {
  type = FILTER_SELECTED_COUNTRY_CITIES;

  constructor(public payload: CitySortOption) {
  }
}

export type Actions =
  LoadCountriesResponse
  | LoadCountriesRequest
  | FilterUpdate
  | SelectCountry
  | LoadDynamicCountryInformationRequest
  | LoadLocalDynamicCountryInformationRequest
  | LoadDynamicCountryInformationResponse
  | FilterSelectedCountryCities ;
