// @ts-nocheck
import { Position } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  Row,
  Col,
  FieldHint,
  CustomersMultiSelect,
  FFormGroup,
  FDateInput,
  FCheckbox,
} from '@/components';
import { momentFormatter } from '@/utils';
import { filterCustomersOptions } from '../constants';
import { useCustomersBalanceSummaryGeneralContext } from './CustomersBalanceSummaryGeneralProvider';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Customers balance header - General panel - Content
 */
export default function CustomersBalanceSummaryGeneralPanelContent() {
  const { customers } = useCustomersBalanceSummaryGeneralContext();

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
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              minimal={true}
              fill={true}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'percentage_column'}
            labelInfo={<FieldHint />}
            fastField
          >
            <FCheckbox
              name={'percentage_column'}
              inline={true}
              small={true}
              label={<T id={'percentage_of_column'} />}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterCustomersOptions}
            label={<T id={'customers.label_filter_customers'} />}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'customersIds'}
            label={<T id={'specific_customers'} />}
          >
            <CustomersMultiSelect name={'customersIds'} items={customers} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
