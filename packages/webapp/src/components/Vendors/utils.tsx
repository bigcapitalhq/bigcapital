// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';

// Filter Contact List
export const itemPredicate = (query, contact, index, exactMatch) => {
  const normalizedTitle = contact.display_name.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${contact.display_name} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
    );
  }
};

export const handleContactRenderer = (contact, { handleClick }) => (
  <MenuItem
    key={contact.id}
    text={contact.display_name}
    onClick={handleClick}
  />
);

// Creates a new item from query.
export const createNewItemFromQuery = (name) => {
  return {
    name,
  };
};

// Handle quick create new customer.
export const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      shouldDismissPopover={false}
      onClick={handleClick}
    />
  );
};
