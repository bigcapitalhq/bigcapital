import React from 'react';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { FastField } from 'formik';
import classNames from 'classnames';
import { Row, Col } from 'components';
import { CLASSES } from 'common/classes';
import Dragzone from 'components/Dragzone';
import { inputIntent } from 'utils';

// Bill form floating actions.
export default function BillFormFooter() {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
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

        <Col md={4}>
          <Dragzone
            initialFiles={[]}
            // onDrop={onDropFiles}
            // onDeleteFile={onDropFiles}
            hint={'Attachments: Maxiumum size: 20MB'}
          />
        </Col>
      </Row>
    </div>
  );
}
