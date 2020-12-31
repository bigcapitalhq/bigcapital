import React from 'react';
import { FastField } from 'formik';
import { handleStringChange } from 'utils';
import { useIntl } from 'react-intl';
import { RadioGroup, Radio } from '@blueprintjs/core';

export default function RadiosAccountingBasis(props) {
  const { key = 'basis', ...rest } = props;
  const { formatMessage } = useIntl();

  return (
    <FastField name={'basis'}>
      {({
        form: { setFieldValue },
        field: { value },
      }) => (
        <RadioGroup
          inline={true}
          label={formatMessage({ id: 'accounting_basis' })}
          name="basis"
          onChange={handleStringChange((value) => {
            setFieldValue(key, value);
          })}
          className={'radio-group---accounting-basis'}
          selectedValue={value}
          {...rest}
        >
          <Radio label={formatMessage({ id: 'cash' })} value="cash" />
          <Radio label={formatMessage({ id: 'accrual' })} value="accural" />
        </RadioGroup>
      )}
    </FastField>
  );
}
