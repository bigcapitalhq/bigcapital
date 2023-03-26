// @ts-nocheck
import { createSelector } from '@reduxjs/toolkit';
import { pickItemsFromIds, getItemById } from '@/store/selectors';

const usersItemsSelector = (state) => state.users.items;
const userIdPropSelector = (state, props) => props.userId;

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
