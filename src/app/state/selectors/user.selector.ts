import { createFeatureSelector, createSelector } from '@ngrx/store'

import { UsersState } from '../reducers/users.reducer'

export const selectUsersState = createFeatureSelector<UsersState>('users')

export const selectUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
)