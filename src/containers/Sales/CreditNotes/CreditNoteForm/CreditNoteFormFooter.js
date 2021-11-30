import React from 'react';
import { FastField } from 'formik';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { CLASSES } from 'common/classes';
import { Row, Col, Postbox } from 'components';
import { inputIntent } from 'utils';
import classNames from 'classnames';

/**
 * Credit note form footer.
 */
export default function CreditNoteFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox
        title={<T id={'credit_note.label_credit_note_details'} />}
        defaultOpen={false}
      >
        <Row>
          <Col md={8}>
            {/* --------- Customer notes --------- */}
            <FastField name={'note'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'credit_note.label_customer_note'} />}
                  className={'form-group--note'}
                  intent={inputIntent({ error, touched })}
                >
                  <TextArea growVertically={true} {...field} />
                </FormGroup>
              )}
            </FastField>
            {/* --------- Terms and conditions --------- */}
            <FastField name={'terms_conditions'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'terms_conditions'} />}
                  className={'form-group--terms_conditions'}
                  intent={inputIntent({ error, touched })}
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
