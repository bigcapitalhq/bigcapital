import React from 'react';
import { FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import {
  Intent,
  FormGroup,
  InputGroup,
  Position,
  Classes,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { CustomersMultiSelect, Row, Col, FieldHint } from 'components';
import { momentFormatter } from 'utils';
// import withCustomers from 'containers/Customers/withCustomers';

import { compose } from 'redux';

/**
 * AR Aging Summary - Drawer Header - General Fields.
 */
function ARAgingSummaryHeaderGeneral({
  // #withCustomers
  customers,
}) {
  return (
    <div>
      <Row>
        <Col xs={5}>
          <FastField name={'asDate'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'as_date'} />}
                labelInfo={<FieldHint />}
                fill={true}
                intent={error && Intent.DANGER}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={value}
                  onChange={(selectedDate) => {
                    form.setFieldValue('asDate', selectedDate);
                  }}
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
          <FastField name={'agingBeforeDays'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'aging_before_days'} />}
                labelInfo={<FieldHint />}
                className={'form-group--aging-before-days'}
                intent={error && Intent.DANGER}
              >
                <InputGroup
                  medium={true}
                  intent={error && Intent.DANGER}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FastField name={'agingPeriods'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'aging_periods'} />}
                labelInfo={<FieldHint />}
                className={'form-group--aging-periods'}
                intent={error && Intent.DANGER}
              >
                <InputGroup
                  medium={true}
                  intent={error && Intent.DANGER}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      <Row>
        <Col xs={5}>
          <FormGroup
            label={<T id={'specific_customers'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
          >
            <CustomersMultiSelect customers={customers} />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}
export default compose(
  // withCustomers(({ customers }) => ({
  //   customers,
  // })),
)(ARAgingSummaryHeaderGeneral);
