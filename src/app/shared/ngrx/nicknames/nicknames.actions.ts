import {Action} from '@ngrx/store';

export const LOAD_NICKNAMES_REQUEST = '[NICKNAMES] LOAD_NICKNAMES_REQUEST';
export const LOAD_NICKNAMES_RESPONSE = '[NICKNAMES] LOAD_NICKNAMES_RESPONSE';

export class LoadNicknamesRequest implements Action {
  type = LOAD_NICKNAMES_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadNicknamesResponse implements Action {
  type = LOAD_NICKNAMES_RESPONSE;

  constructor(public payload: { [address: string]: string }) {
  }
}

export type Actions = LoadNicknamesResponse | LoadNicknamesRequest;
