import { Position } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { useAPAgingSummaryGeneralContext } from './APAgingSummaryGeneralProvider';
import { filterVendorsOptions } from './constants';
import {
  Row,
  Col,
  FieldHint,
  FFormGroup,
  VendorsMultiSelect,
  FDateInput,
  FInputGroup,
} from '@/components';
import { momentFormatter } from '@/utils';

export function APAgingSummaryHeaderGeneralContent() {
  const { vendors } = useAPAgingSummaryGeneralContext();

  return (
    <div>
      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'asDate'}
            label={intl.get('as_date')}
            labelInfo={<FieldHint />}
            fastField
          >
            <FDateInput
              name={'asDate'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
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
            label={intl.get('aging_before_days')}
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
            label={intl.get('aging_periods')}
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
            label={intl.get('AP_aging_summary.filter_options.label')}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup label={intl.get('specific_vendors')} name={'vendorsIds'}>
            <VendorsMultiSelect name={'vendorsIds'} items={vendors} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
