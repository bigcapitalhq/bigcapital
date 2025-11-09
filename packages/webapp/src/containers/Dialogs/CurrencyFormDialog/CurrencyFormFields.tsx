// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { useCurrencyFormContext } from './CurrencyFormProvider';
import { FieldRequiredHint, FFormGroup, FInputGroup, FSelect } from '@/components';

import { useAutofocus } from '@/hooks';
import { currenciesOptions } from '@/utils';

/**
 * Currency form fields.
 */
export default function CurrencyFormFields() {
  const currencyNameFieldRef = useAutofocus();
  const { isEditMode } = useCurrencyFormContext();
  const { setFieldValue } = useFormikContext();

  // Filter currency code
  const filterCurrencyCode = (query, currency, _index, exactMatch) => {
    const normalizedTitle = currency.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  return (
    <div className={Classes.DIALOG_BODY}>
      <FFormGroup
        name={'currency_code'}
        label={<T id={'currency_code'} />}
      >
        <FSelect
          name={'currency_code'}
          items={currenciesOptions}
          valueAccessor={'currency_code'}
          textAccessor={'formatted_name'}
          placeholder={<T id={'select_currency_code'} />}
          onItemSelect={(currency) => {
            setFieldValue('currency_code', currency.currency_code);
            setFieldValue('currency_name', currency.name);
            setFieldValue('currency_sign', currency.symbol);
          }}
          itemPredicate={filterCurrencyCode}
          disabled={isEditMode}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>

      {/* ----------- Currency name ----------- */}
      <FFormGroup
        name={'currency_name'}
        label={<T id={'currency_name'} />}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup
          name={'currency_name'}
          inputRef={(ref) => (currencyNameFieldRef.current = ref)}
        />
      </FFormGroup>

      {/* ----------- Currency Code ----------- */}
      <FFormGroup
        name={'currency_sign'}
        label={<T id={'currency_sign'} />}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup name={'currency_sign'} />
      </FFormGroup>
    </div>
  );
}
