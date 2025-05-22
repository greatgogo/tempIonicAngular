import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

// NgRx User Selectors
//
// This file defines selectors to access user-related state from the global store.
// Selectors are used in components and services to read specific slices of state efficiently.
//
// - selectUserState: Selects the entire user feature state.
// - selectUser: Selects the user object from the user state.

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);