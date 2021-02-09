import React, { useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { Form, useFormikContext, FastField } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';
import {
  ErrorMessage,
  AppToaster,
  FieldRequiredHint,
  DialogContent,
} from 'components';

import { useAutofocus } from 'hooks';
import { inputIntent } from 'utils';

export default function CurrencyFormFields() {
  const currencyNameFieldRef = useAutofocus();
  
  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Currency name ----------- */}
      <FastField name={'currency_name'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency_name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--currency-name'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_name" />}
            inline={true}
          >
            <InputGroup
              inputRef={(ref) => (currencyNameFieldRef.current = ref)}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Currency Code ----------- */}
      <FastField name={'currency_code'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'currency_code'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--currency-code'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="currency_code" />}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
