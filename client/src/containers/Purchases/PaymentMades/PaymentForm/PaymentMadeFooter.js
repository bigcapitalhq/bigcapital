import React from 'react';
import classNames from 'classnames';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { FastField } from 'formik';
import { Postbox, Row, Col } from 'components';
import { CLASSES } from 'common/classes';

/**
 * Payment made form footer.
 */
export default function PaymentMadeFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'payment_made_details'} />} defaultOpen={false}>
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
