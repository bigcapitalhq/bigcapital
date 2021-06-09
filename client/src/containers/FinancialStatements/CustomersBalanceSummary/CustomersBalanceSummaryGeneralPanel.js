import React from 'react';
import { FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import {
  FormGroup,
  Position,
  Classes,
  Checkbox,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import { Row, Col, FieldHint } from 'components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';

/**
 * Customers balance header - general panel.
 */
export default function CustomersBalanceSummaryGeneralPanel() {
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
          <FastField name={'percentage'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  name={'percentage'}
                  small={true}
                  label={<T id={'percentage_of_column'}/>}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}
