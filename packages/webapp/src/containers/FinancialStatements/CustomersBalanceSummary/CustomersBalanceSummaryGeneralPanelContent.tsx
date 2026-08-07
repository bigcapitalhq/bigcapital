import { Position } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { filterCustomersOptions } from '../constants';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { useCustomersBalanceSummaryGeneralContext } from './CustomersBalanceSummaryGeneralProvider';
import {
  Row,
  Col,
  FieldHint,
  CustomersMultiSelect,
  FFormGroup,
  FDateInput,
  FCheckbox,
} from '@/components';
import { momentFormatter } from '@/utils';

/**
 * Customers balance header - General panel - Content
 */
export function CustomersBalanceSummaryGeneralPanelContent() {
  const { customers } = useCustomersBalanceSummaryGeneralContext();

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
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
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
              label={intl.get('percentage_of_column')}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterCustomersOptions}
            label={intl.get('customers.label_filter_customers')}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup
            name={'customersIds'}
            label={intl.get('specific_customers')}
          >
            <CustomersMultiSelect name={'customersIds'} items={customers} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
