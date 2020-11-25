import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export default function CurrencySelectList({
  currenciesList,
  selectedCurrencyCode,
  defaultSelectText = <T id={'select_currency_code'} />,
  onCurrencySelected,
  popoverFill = false,
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
        text={
          selectedCurrency ? selectedCurrencyCode : defaultSelectText
        }
      />
    </Select>
  );
}
