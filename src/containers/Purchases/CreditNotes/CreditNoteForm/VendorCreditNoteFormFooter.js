import React from 'react';
import { FastField } from 'formik';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { CLASSES } from 'common/classes';
import { Row, Col, Postbox } from 'components';
import { inputIntent } from 'utils';
import classNames from 'classnames';

/**
 * Vendor Credit note form footer.
 */
export default function VendorCreditNoteFormFooter() {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox
        title={<T id={'credit_note.label_credit_note_details'} />}
        defaultOpen={false}
      >
        <Row>
          <Col md={8}>
            <FastField name={'note'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'note'} />}
                  className={'form-group--note'}
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
