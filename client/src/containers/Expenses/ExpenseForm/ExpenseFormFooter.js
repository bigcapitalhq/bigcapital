import React from 'react';
import { FastField } from 'formik';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { inputIntent } from 'utils';
import { Row, Dragzone, Col, Postbox } from 'components';
import { CLASSES } from 'common/classes';

export default function ExpenseFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'expense_details'} />} defaultOpen={false}>
        <Row>
          <Col md={8}>
            <FastField name={'description'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'description'} />}
                  className={'form-group--description'}
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
