import React from 'react';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { ErrorMessage, Row, Col } from 'components';
import Dragzone from 'components/Dragzone';
import { inputIntent } from 'utils';

export default function MakeJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
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
            hint={'Attachments: Maxiumum size: 20MB'}
          />
        </Col>
      </Row>
    </div>
  );
}
