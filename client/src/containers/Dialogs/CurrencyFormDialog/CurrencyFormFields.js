import React from 'react';
import { Classes, FormGroup, InputGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
import { FormattedMessage as T } from 'react-intl';

import { useCurrencyFormContext } from './CurrencyFormProvider';
import { ErrorMessage, FieldRequiredHint, ListSelect } from 'components';

import { useAutofocus } from 'hooks';
import { inputIntent, currenciesOptions } from 'utils';

/**
 * Currency form fields.
 */
export default function CurrencyFormFields() {
  const currencyNameFieldRef = useAutofocus();

  const { isEditMode } = useCurrencyFormContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FastField name={'currency_code'}>
        {({
          form: { setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup label={'Currency code'}>
            <ListSelect
              items={currenciesOptions}
              selectedItemProp={'currency_code'}
              selectedItem={value}
              textProp={'formatted_name'}
              defaultText={'Select currency code'}
              onItemSelect={(currency) => {
                setFieldValue('currency_code', currency.currency_code);
                setFieldValue('currency_name', currency.name);
                setFieldValue('currency_sign', currency.symbol);
              }}
              disabled={isEditMode}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Currency name ----------- */}
      <FastField name={'currency_name'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency_name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--currency-name'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_name" />}
            // inline={true}
          >
            <InputGroup
              inputRef={(ref) => (currencyNameFieldRef.current = ref)}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Currency Code ----------- */}
      <FastField name={'currency_sign'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency_sign'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--currency-sign'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_sign" />}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
