import {Action} from '@ngrx/store';

export const LOAD_ALL = '[COMMON] LOAD_ALL';
export const SHOW_ERROR = '[COMMON] SHOW_ERROR';
export const ADD_NEW_MESSAGE = '[COMMON] ADD_NEW_MESSAGE';
export const LOAD_WALLET_DATA_REQUEST = '[COMMON] LOAD_WALLET_DATA_REQUEST';
export const LOAD_WALLET_DATA_RESPONSE = '[COMMON] LOAD_WALLET_DATA_RESPONSE';
export const WITHDRAW_REQUEST = '[COMMON] WITHDRAW_REQUEST';
export const WITHDRAW_SUCCESS = '[COMMON] WITHDRAW_SUCCESS';
export const WITHDRAW_ERROR = '[COMMON] WITHDRAW_ERROR';

export class LoadAllData implements Action {
  type = LOAD_ALL;

  constructor(public payload?: any) {
  }
}

export class ShowErrorMessage implements Action {
  type = SHOW_ERROR;

  constructor(public payload?: any) {
  }
}

export class LoadWalletDataRequest implements Action {
  type = LOAD_WALLET_DATA_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadWalletDataResponse implements Action {
  type = LOAD_WALLET_DATA_RESPONSE;

  constructor(public payload?: any) {
  }
}

export class AddNewMessage implements Action {
  type = ADD_NEW_MESSAGE;

  constructor(public payload?: any) {
  }
}

export class WithdrawRequest implements Action {
  type = WITHDRAW_REQUEST;

  constructor(public payload?: any) {
  }
}

export class WithdrawSuccess implements Action {
  type = WITHDRAW_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class WithdrawError implements Action {
  type = WITHDRAW_ERROR;

  constructor(public payload?: any) {
  }
}

export type Actions =
  LoadAllData
  | ShowErrorMessage
  | AddNewMessage
  | LoadWalletDataRequest
  | LoadWalletDataResponse
  | WithdrawRequest
  | WithdrawError
  | WithdrawSuccess;
