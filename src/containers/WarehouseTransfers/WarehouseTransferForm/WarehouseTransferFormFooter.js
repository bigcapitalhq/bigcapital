import React from 'react';
import classNames from 'classnames';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { FastField, ErrorMessage } from 'formik';
import { Row, Col, Postbox } from 'components';
import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';

export default function WarehouseTransferFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox
        title={<T id={'warehouse_transfer.label.warehouse_transfer_detail'} />}
        defaultOpen={false}
      >
        <Row>
          <Col md={8}>
            {/*------------ reason -----------*/}
            <FastField name={'reason'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'reason'} />}
                  className={'form-group--reason'}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name={'reason'} />}
                >
                  <TextArea
                    growVertically={true}
                    large={true}
                    intent={inputIntent({ error, touched })}
                    {...field}
                  />
                </FormGroup>
              )}
            </FastField>
          </Col>
        </Row>
      </Postbox>
    </div>
  );
}
