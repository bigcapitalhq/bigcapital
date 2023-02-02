// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from '@/components';

/**
 *
 * @param query
 * @param expense
 * @param _index
 * @param exactMatch
 */
const expenseItemPredicate = (query, expense, _index, exactMatch) => {
  const normalizedTitle = expense.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${expense.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param expense
 * @param param1
 * @returns
 */
const expenseItemRenderer = (expense, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={expense.id}
      onClick={handleClick}
      text={expense.name}
    />
  );
};

const expenseSelectProps = {
  itemPredicate: expenseItemPredicate,
  itemRenderer: expenseItemRenderer,
  valueAccessor: 'id',
  labelAccessor: 'name',
};

export function ExpenseSelect({ expenses, defaultText, ...rest }) {
  return (
    <FSelect
      items={expenses}
      {...expenseSelectProps}
      {...rest}
      input={ExpenseSelectButton}
    />
  );
}

function ExpenseSelectButton({ label, ...rest }) {
  return (
    <Button
      text={label ? label : intl.get('choose_an_estimated_expense')}
      {...rest}
    />
  );
}
