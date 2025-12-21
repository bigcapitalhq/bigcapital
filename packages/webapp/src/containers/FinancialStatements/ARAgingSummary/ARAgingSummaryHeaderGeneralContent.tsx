// @ts-nocheck
import React from 'react';
import { Position } from '@blueprintjs/core';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import {
  FormattedMessage as T,
  Row,
  Col,
  FieldHint,
  FInputGroup,
  FFormGroup,
  CustomersMultiSelect,
  FDateInput,
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
          <FFormGroup
            name={'asDate'}
            label={<T id={'as_date'} />}
            labelInfo={<FieldHint />}
            fill
            fastField
          >
            <FDateInput
              name={'asDate'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              minimal
              fill
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'agingDaysBefore'}
            label={<T id={'aging_before_days'} />}
            labelInfo={<FieldHint />}
            fastField
          >
            <FInputGroup name={'agingDaysBefore'} medium={true} fastField />
          </FFormGroup>
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
