import React from 'react';
import { handleStringChange } from 'utils';
import { useIntl } from 'react-intl';
import { RadioGroup, Radio } from '@blueprintjs/core';

export default function RadioCustomer(props) {
  const { onChange, ...rest } = props;
  const { formatMessage } = useIntl();
  return (
    <RadioGroup
      inline={true}
      label={formatMessage({ id: 'customer_type' })}
      onChange={handleStringChange((value) => {
        onChange && onChange(value);
      })}
      {...rest}
    >
      <Radio label={formatMessage({ id: 'business' })} value="business" />
      <Radio label={formatMessage({ id: 'individual' })} value="individual" />
    </RadioGroup>
  );
}
