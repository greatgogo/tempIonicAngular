import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

// NgRx Actions for User State Management
//
// This file defines all actions related to user authentication and state management.
// Actions are dispatched from components or effects to trigger state changes in reducers.
//
// - setUser: Sets the user's name (example action, not used in reducer).
// - loadUser: Initiates loading a user (could be used with effects).
// - loginSuccess: Sets the user object in the store after successful login.
// - logout: Clears the user state.
// - loadUserFailure: Handles user load errors.

export const setUser = createAction(
  '[User] Set User',
  props<{ name: string }>()
);

export const signup = createAction(
  '[User] Signup',
  props<{ user: { name: string; email: string; password: string } }>()
);

export const loadUser = createAction('[User] Load');
export const loginSuccess = createAction('[User] Login Success', props<{ user: User }>());
export const logout = createAction('[User] Logout');
export const loadUserFailure = createAction('[User] Load Failure', props<{ error: any }>());

// Action to update user details (name, email, phone)
export const updateUser = createAction(
  '[User] Update User',
  props<{ name: string; email: string; phone: string }>()
);