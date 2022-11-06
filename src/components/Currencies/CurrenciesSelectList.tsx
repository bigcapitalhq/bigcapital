// @ts-nocheck
import React, { useCallback } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export function CurrenciesSelectList({ selectProps, onItemSelect, className }) {
  const currencies = [
    {
      name: 'USD US dollars',
      key: 'USD',
      name: 'CAD Canadian dollars',
      key: 'CAD',
    },
  ];

  // Handle currency item select.
  const onCurrencySelect = useCallback(
    (currency) => {
      onItemSelect && onItemSelect(currency);
    },
    [onItemSelect],
  );

  // Filters currencies list.
  const filterCurrenciesPredicator = useCallback(
    (query, currency, _index, exactMatch) => {
      const normalizedTitle = currency.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();
      return `${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    },
    [],
  );

  // Currency item of select currencies field.
  const currencyItem = (item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick}
      />
    );
  };

  return (
    <Select
      items={currencies}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={currencyItem}
      itemPredicate={filterCurrenciesPredicator}
      popoverProps={{ minimal: true }}
      onItemSelect={onCurrencySelect}
      {...selectProps}
    >
      <Button text={'USD US dollars'} />
    </Select>
  );
}
