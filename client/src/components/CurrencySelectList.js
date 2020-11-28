import React, { useCallback, useState } from 'react';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { ListSelect } from 'components';
import { MenuItem } from '@blueprintjs/core';

export default function CurrencySelectList({
  currenciesList,
  selectedCurrencyCode,
  defaultSelectText = <T id={'select_currency_code'} />,
  onCurrencySelected,
  className,
  ...restProps
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
    <ListSelect
      items={currenciesList}
      selectedItemProp={'currency_code'}
      selectedItem={selectedCurrencyCode}
      labelProp={'currency_code'}
      defaultText={defaultSelectText}
      onItemSelect={onCurrencySelect}
      itemPredicate={filterCurrencies}
      itemRenderer={currencyCodeRenderer}
      popoverProps={{ minimal: true }}
      className={classNames('form-group--select-list', className)}
      {...restProps}
    />
  );
}
