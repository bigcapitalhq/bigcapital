import React from 'react';
import classNames from 'classnames';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { FastField } from 'formik';
import { Row, Col, Postbox } from 'components';
import { CLASSES } from 'common/classes';

/**
 * Payment receive form footer.
 */
export default function PaymentReceiveFormFooter({ getFieldProps }) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'payment_receive_details'} />} defaultOpen={false}>
        <Row>
          <Col md={8}>
            {/* --------- Statement --------- */}
            <FastField name={'statement'}>
              {({ form, field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'statement'} />}
                  className={'form-group--statement'}
                >
                  <TextArea growVertically={true} {...field} />
                </FormGroup>
              )}
            </FastField>
          </Col>
        </Row>
      </Postbox>
    </div>
  );
}
