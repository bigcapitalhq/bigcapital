import React from 'react';
import { FormGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { FastField } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { Row, Col, Postbox } from 'components';
import Dragzone from 'components/Dragzone';

import { inputIntent } from 'utils';

/**
 * Estimate form footer.
 */
export default function EstiamteFormFooter({}) {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Postbox title={<T id={'estimate_details'} />} defaultOpen={false}>
        <Row>
          <Col md={8}>
            {/* --------- Customer Note --------- */}
            <FastField name={'note'}>
              {({ form, field, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'customer_note'} />}
                  className={'form-group--customer_note'}
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
