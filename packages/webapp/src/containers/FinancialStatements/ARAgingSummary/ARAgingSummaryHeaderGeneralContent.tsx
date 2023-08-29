// @ts-nocheck
import React from 'react';
import { FastField, Field } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { Intent, FormGroup, InputGroup, Position } from '@blueprintjs/core';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import {
  FormattedMessage as T,
  Row,
  Col,
  FieldHint,
  FInputGroup,
  FFormGroup,
  CustomersMultiSelect,
} from '@/components';
import { momentFormatter } from '@/utils';
import { useARAgingSummaryGeneralContext } from './ARAgingSummaryGeneralProvider';
import { filterCustomersOptions } from './constants';

/**
 * AR Aging Summary - Drawer Header - General Fields.
 */
export default function ARAgingSummaryHeaderGeneralContent() {
  // AR Aging summary context.
  const { customers } = useARAgingSummaryGeneralContext();

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
          <FastField name={'agingDaysBefore'}>
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
          <FFormGroup
            name={'agingPeriods'}
            label={<T id={'aging_periods'} />}
            labelInfo={<FieldHint />}
          >
            <FInputGroup name={'agingPeriods'} medium={true} />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterCustomersOptions}
            label={<T id={'AR_aging_summary.filter_options.label'} />}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name="customersIds"
            label={<T id={'specific_customers'} />}
          >
            <CustomersMultiSelect name="customersIds" items={customers} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
