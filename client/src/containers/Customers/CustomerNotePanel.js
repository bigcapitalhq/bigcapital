import React from 'react';
import classNames from 'classnames';
import { FormGroup, Intent, TextArea, Classes } from '@blueprintjs/core';
import { Row, Col } from 'components';
import { FormattedMessage as T } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';

export default function CustomerNotePanel({ errors, touched, getFieldProps }) {
  return (
    <div className={'tab-panel--note'}>
      <FormGroup
        label={<T id={'note'} />}
        className={classNames('form-group--note', Classes.FILL)}
        intent={errors.note && touched.note && Intent.DANGER}
        helperText={
          <ErrorMessage name="payment_date" {...{ errors, touched }} />
        }
      >
        <TextArea
          intent={errors.note && touched.note && Intent.DANGER}
          {...getFieldProps('note')}
        />
      </FormGroup>
    </div>
  );
}
 