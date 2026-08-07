import { Position } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { filterInventoryValuationOptions } from '../constants';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import {
  InventoryValuationGeneralPanelProvider,
  useInventoryValuationGeneralPanelContext,
} from './InventoryValuationHeaderGeneralPanelProvider';
import {
  FItemsMultiSelect,
  Row,
  Col,
  FieldHint,
  FFormGroup,
  FDateInput,
} from '@/components';
import { momentFormatter } from '@/utils';

/**
 * Inventory valuation - Drawer Header - General panel.
 */
export function InventoryValuationHeaderGeneralPanel() {
  return (
    <InventoryValuationGeneralPanelProvider>
      <InventoryValuationHeaderGeneralPanelContent />
    </InventoryValuationGeneralPanelProvider>
  );
}

/**
 * Inventory valuation - Drawer Header - General panel - Content.
 */
function InventoryValuationHeaderGeneralPanelContent() {
  const { items } = useInventoryValuationGeneralPanelContext();

  return (
    <div>
      <Row>
        <Col xs={4}>
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
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterInventoryValuationOptions}
            label={intl.get('items.label_filter_items')}
            initialSelectedItem={'all-items'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup name={'itemsIds'} label={intl.get('Specific items')}>
            <FItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
