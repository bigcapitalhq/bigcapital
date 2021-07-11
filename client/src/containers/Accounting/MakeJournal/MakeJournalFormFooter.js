import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { Postbox, ErrorMessage, Row, Col } from 'components';
import Dragzone from 'components/Dragzone';
import { inputIntent } from 'utils';

export default function MakeJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'journal_details'} />} defaultOpen={false}>
        <Row>
          <Col md={8}>
            <FastField name={'description'}>
              {({ field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'description'} />}
                  className={'form-group--description'}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name="description" />}
                  fill={true}
                >
                  <TextArea fill={true} {...field} />
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
