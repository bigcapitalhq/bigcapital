// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/core';
import { FormattedMessage as T, FFormGroup, FTextArea } from '@/components';

export default function CustomerNotePanel({ errors, touched, getFieldProps }) {
  return (
    <div className={'tab-panel--note'}>
      <FFormGroup name={'note'} label={<T id={'note'} />} inline={false}>
        <FTextArea name={'note'} />
      </FFormGroup>
    </div>
  );
}
