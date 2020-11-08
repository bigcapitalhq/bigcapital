import React from 'react';
import classNames from 'classnames';
import { FormGroup, Intent, TextArea, Classes } from '@blueprintjs/core';
import { Row, Col } from 'components';
import { FormattedMessage as T } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';

export default function CustomerNotePanel({ errors, touched, getFieldProps }) {
  return (
    <div
      className={
        'customer-form__tabs-section customer-form__tabs-section--note'
      }
    >
      <Row>
        <Col xs={6}>
          <FormGroup
            label={<T id={'note'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
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
        </Col>
      </Row>
    </div>
  );
}
