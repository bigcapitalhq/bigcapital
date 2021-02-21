import React from 'react';
import { FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { Intent, FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col, FieldHint } from 'components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';

/**
 * AP Aging Summary - Drawer Header - General Fields.
 */
export default function APAgingSummaryHeaderGeneral() {
  return (
    <div>
      <Row>
        <Col xs={5}>
          <FastField name={'asDate'}>
            {({ form, field: { value }, meta: { error } }) => (
              <FormGroup
                label={<T id={'as_date'} />}
                labelInfo={<FieldHint />}
                fill={true}
                intent={inputIntent({ error })}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  onChange={handleDateChange((selectedDate) => {
                    form.setFieldValue('asDate', selectedDate);
                  })}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  minimal={true}
                  fill={true}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      <Row>
        <Col xs={5}>
          <FastField name={'aging_days_before'}>
            {({ field, meta: { error } }) => (
              <FormGroup
                label={<T id={'aging_before_days'} />}
                labelInfo={<FieldHint />}
                intent={inputIntent({ error })}
              >
                <InputGroup intent={error && Intent.DANGER} {...field} />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      <Row>
        <Col xs={5}>
          <FastField name={'aging_periods'}>
            {({ field, meta: { error } }) => (
              <FormGroup
                label={<T id={'aging_periods'} />}
                labelInfo={<FieldHint />}
                intent={inputIntent({ error })}
              >
                <InputGroup intent={error && Intent.DANGER} {...field} />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}
