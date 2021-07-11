import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { CLASSES } from 'common/classes';
import { Row, Col, Postbox } from 'components';
import Dragzone from 'components/Dragzone';

import { inputIntent } from 'utils';

export default function InvoiceFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'invoice_details'} />} defaultOpen={false}>
        <Row>
          <Col md={8}>
            {/* --------- Invoice message --------- */}
            <FastField name={'invoice_message'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'invoice_message'} />}
                  className={'form-group--invoice_message'}
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

          <Col md={4}>
            <Dragzone
              initialFiles={[]}
              // onDrop={handleDropFiles}
              // onDeleteFile={handleDeleteFile}
              hint={<T id={'attachments_maximum'} />}
            />
          </Col>
        </Row>
      </Postbox>
    </div>
  );
}
