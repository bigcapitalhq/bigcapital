import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, getItemById } from '@/store/selectors';
import type { RootState } from '@/store/reducers';

const usersItemsSelector = (state: RootState) => state.users.items;
const userIdPropSelector = (state: RootState, props: { userId: string | number }) => props.userId;

export const getExpensesCurrentPageFactory = createSelector(
  usersItemsSelector,
  (users) => {
    return Object.values(users);
  },
);


export const getUserByIdFactory = () => createSelector(
  usersItemsSelector,
  userIdPropSelector,
  (users, userId) => {
    return getItemById(users, userId);
  },
);
