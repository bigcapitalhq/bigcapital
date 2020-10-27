import React from 'react';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'components';
import Dragzone from 'components/Dragzone';

export default function BillFloatingActions({
  formik: { getFieldProps },
  oninitialFiles,
  onDropFiles,
}) {
  return (
    <div class="page-form__footer">
      <Row>
        <Col md={8}>
          <FormGroup label={<T id={'note'} />} className={'form-group--note'}>
            <TextArea growVertically={true} {...getFieldProps('note')} />
          </FormGroup>
        </Col>

        <Col md={4}>
          <Dragzone
            initialFiles={oninitialFiles}
            onDrop={onDropFiles}
            onDeleteFile={onDropFiles}
            hint={'Attachments: Maxiumum size: 20MB'}
          />
        </Col>
      </Row>
    </div>
  );
}
