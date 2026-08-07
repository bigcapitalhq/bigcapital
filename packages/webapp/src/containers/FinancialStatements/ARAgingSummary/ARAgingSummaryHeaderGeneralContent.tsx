import { Position } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { useARAgingSummaryGeneralContext } from './ARAgingSummaryGeneralProvider';
import { filterCustomersOptions } from './constants';
import {
  Row,
  Col,
  FieldHint,
  FInputGroup,
  FFormGroup,
  CustomersMultiSelect,
  FDateInput,
} from '@/components';
import { momentFormatter } from '@/utils';

export function ARAgingSummaryHeaderGeneralContent() {
  const { customers } = useARAgingSummaryGeneralContext();

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
            fastField
          >
            <FInputGroup name={'agingDaysBefore'} fastField />
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
            items={filterCustomersOptions}
            label={intl.get('AR_aging_summary.filter_options.label')}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name="customersIds"
            label={intl.get('specific_customers')}
          >
            <CustomersMultiSelect name="customersIds" items={customers} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
