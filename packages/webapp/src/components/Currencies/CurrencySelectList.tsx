// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export function CurrencySelectList({
  currenciesList,
  selectedCurrencyCode,
  defaultSelectText = <T id={'select_currency_code'} />,
  onCurrencySelected,
  popoverFill = false,
  disabled = false,
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // Filters currencies list.
  const filterCurrencies = (query, currency, _index, exactMatch) => {
    const normalizedTitle = currency.currency_code.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${currency.currency_code} ${normalizedTitle}`.indexOf(
          normalizedQuery,
        ) >= 0
      );
    }
  };

  const onCurrencySelect = useCallback((currency) => {
    setSelectedCurrency({ ...currency });
    onCurrencySelected && onCurrencySelected(currency);
  });

  const currencyCodeRenderer = useCallback((CurrencyCode, { handleClick }) => {
    return (
      <MenuItem
        key={CurrencyCode.id}
        text={CurrencyCode.currency_code}
        onClick={handleClick}
      />
    );
  }, []);

  useEffect(() => {
    if (typeof selectedCurrencyCode !== 'undefined') {
      const currency = selectedCurrencyCode
        ? currenciesList.find((a) => a.currency_code === selectedCurrencyCode)
        : null;
      setSelectedCurrency(currency);
    }
  }, [selectedCurrencyCode, currenciesList, setSelectedCurrency]);

  return (
    <Select
      items={currenciesList}
      itemRenderer={currencyCodeRenderer}
      itemPredicate={filterCurrencies}
      onItemSelect={onCurrencySelect}
      filterable={true}
      popoverProps={{
        minimal: true,
        usePortal: !popoverFill,
        inline: popoverFill,
      }}
      className={classNames('form-group--select-list', {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    >
      <Button
        disabled={disabled}
        text={
          selectedCurrency ? selectedCurrency.currency_code : defaultSelectText
        }
      />
    </Select>
  );
}
