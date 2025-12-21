// @ts-nocheck
import React from 'react';
import { Position } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  Row,
  Col,
  FieldHint,
  FFormGroup,
  VendorsMultiSelect,
  FDateInput,
  FInputGroup,
} from '@/components';
import { useAPAgingSummaryGeneralContext } from './APAgingSummaryGeneralProvider';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterVendorsOptions } from './constants';
import { momentFormatter } from '@/utils';

/**
 * AP Aging Summary - Drawer Header - General panel - Content.
 */
export default function APAgingSummaryHeaderGeneralContent() {
  const { vendors } = useAPAgingSummaryGeneralContext();

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
          >
            <FInputGroup name={'agingDaysBefore'} />
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
            <FInputGroup name={'agingPeriods'} />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterVendorsOptions}
            label={<T id={'AP_aging_summary.filter_options.label'} />}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup label={<T id={'specific_vendors'} />} name={'vendorsIds'}>
            <VendorsMultiSelect name={'vendorsIds'} items={vendors} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
