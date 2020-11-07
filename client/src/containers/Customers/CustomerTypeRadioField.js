import React from 'react';
import classNames from 'classnames';
import { RadioGroup, Radio, FormGroup } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { handleStringChange } from 'utils';

/**
 * Customer type radio field.
 */
export default function RadioCustomer(props) {
  const { onChange, ...rest } = props;
  const { formatMessage } = useIntl();

  return (
    <FormGroup
      inline={true}
      label={<T id={'customer_type'} />}
      className={classNames('form-group--customer_type')}>
      <RadioGroup  
        inline={true}
        onChange={handleStringChange((value) => {
          onChange && onChange(value);
        })}
        {...rest}
      >
        <Radio label={formatMessage({ id: 'business' })} value="business" />
        <Radio label={formatMessage({ id: 'individual' })} value="individual" />
      </RadioGroup>
    </FormGroup>
  );
}
