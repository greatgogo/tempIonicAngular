import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout, updateUser, signup } from '../actions/user.actions';
import { User } from '../../core/models/user.model';

// NgRx User Reducer
//
// This file defines the reducer for user state management.
// The reducer listens for actions and updates the user state accordingly.
//
// - UserState: Interface describing the shape of user state.
// - initialState: The default state when the app starts or after logout.
// - userReducer: Handles loginSuccess (sets user) and logout (clears user).

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null
};

export const userReducer = createReducer(
  initialState,
    on(signup, (state, { user }) => ({
    ...state,
    id: Date.now(), // Simulate user ID
    name: user.name,
    email: user.email,
  })),
  on(loginSuccess, (state, { user }) => ({ ...state, user })), // Set user on login
  on(updateUser, (state, { name, email, phone }) => ({
    ...state,
    user: state.user ? { ...state.user, name, email, phone } : null
  })), // Update user details
  on(logout, () => initialState) // Reset state on logout
);