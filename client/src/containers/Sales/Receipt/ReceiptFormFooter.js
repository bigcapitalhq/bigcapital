import React from 'react';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FastField } from 'formik';
import classNames from 'classnames';
import { FormattedMessage as T } from 'react-intl';
import { Dragzone, Row, Col } from 'components';
import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';

export default function ReceiptFormFooter({}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Row>
        <Col md={8}>
          {/* --------- Receipt message --------- */}
          <FastField name={'receipt_message'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'receipt_message'} />}
                className={'form-group--receipt_message'}
                intent={inputIntent({ error, touched })}
              >
                <TextArea growVertically={true} {...field} />
              </FormGroup>
            )}
          </FastField>

          {/* --------- Statement--------- */}
          <FastField name={'statement'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'statement'} />}
                className={'form-group--statement'}
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
            hint={'Attachments: Maxiumum size: 20MB'}
          />
        </Col>
      </Row>
    </div>
  );
}
