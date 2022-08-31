import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';

export const setUser = createAction(
  '[Auth Component] Set user',
  props<{ user: Usuario }>()
);

export const unsetUser = createAction(
  '[Auth Component] Unset user'
);
