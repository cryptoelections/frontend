import {Action} from '@ngrx/store';

export const SHOW_ERROR = '[COMMON] SHOW_ERROR';

export class ShowErrorMessage implements Action {
  type = SHOW_ERROR;

  constructor(public payload?: any) {
  }
}

export type Actions = ShowErrorMessage;
