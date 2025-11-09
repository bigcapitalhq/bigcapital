// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Radio } from '@blueprintjs/core';
import { FormattedMessage as T, FFormGroup, FRadioGroup } from '@/components';

import { handleStringChange, saveInvoke } from '@/utils';

/**
 * Customer type radio field.
 */
export default function RadioCustomer() {
  return (
    <FFormGroup
      name={'customer_type'}
      label={<T id={'customer_type'} />}
      inline
      fastField
    >
      <FRadioGroup name={'customer_type'} inline>
        <Radio label={intl.get('business')} value="business" />
        <Radio label={intl.get('individual')} value="individual" />
      </FRadioGroup>
    </FFormGroup>
  );
}
