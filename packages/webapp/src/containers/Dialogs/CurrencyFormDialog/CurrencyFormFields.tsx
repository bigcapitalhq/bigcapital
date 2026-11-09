import { Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useCurrencyFormContext } from './CurrencyFormProvider';
import type { CurrencyFormValues } from './types';
import {
  FieldRequiredHint,
  FFormGroup,
  FInputGroup,
  FSelect,
  FormattedMessage as T,
} from '@/components';
import { useAutofocus } from '@/hooks';
import { currenciesOptions } from '@/utils';

interface CurrencyOption {
  currency_code: string;
  name: string;
  symbol?: string;
  formatted_name?: string;
  [key: string]: unknown;
}

/**
 * Currency form fields.
 */
export function CurrencyFormFields(): React.ReactElement {
  const currencyNameFieldRef = useAutofocus();
  const { isEditMode } = useCurrencyFormContext();
  const { setFieldValue } = useFormikContext<CurrencyFormValues>();

  // Filter currency code
  const filterCurrencyCode = (
    query: string,
    currency: CurrencyOption,
    _index: number,
    exactMatch: boolean,
  ) => {
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
      <FFormGroup name={'currencyCode'} label={intl.get('currency_code')}>
        <FSelect
          name={'currencyCode'}
          items={currenciesOptions}
          valueAccessor={'currency_code'}
          textAccessor={'formatted_name'}
          placeholder={<T id={'select_currency_code'} />}
          onItemSelect={(currency: CurrencyOption) => {
            setFieldValue('currencyCode', currency.currency_code);
            setFieldValue('currencyName', currency.name);
            setFieldValue('currencySign', currency.symbol);
          }}
          itemPredicate={filterCurrencyCode}
          disabled={!!isEditMode}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>

      {/* ----------- Currency name ----------- */}
      <FFormGroup
        name={'currencyName'}
        label={intl.get('currency_name')}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup
          name={'currencyName'}
          inputRef={(ref: HTMLInputElement | null) =>
            (currencyNameFieldRef.current = ref)
          }
        />
      </FFormGroup>

      {/* ----------- Currency Code ----------- */}
      <FFormGroup
        name={'currencySign'}
        label={intl.get('currency_sign')}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup name={'currencySign'} />
      </FFormGroup>
    </div>
  );
}
