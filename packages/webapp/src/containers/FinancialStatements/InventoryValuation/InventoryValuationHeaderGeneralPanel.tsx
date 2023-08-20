// @ts-nocheck
import React from 'react';
import { FastField, Field } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { FormGroup, Position } from '@blueprintjs/core';

import {
  FormattedMessage as T,
  ItemsMultiSelect,
  Row,
  Col,
  FieldHint,
  FFormGroup,
} from '@/components';
import { filterInventoryValuationOptions } from '../constants';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';
import {
  InventoryValuationGeneralPanelProvider,
  useInventoryValuationGeneralPanelContext,
} from './InventoryValuationHeaderGeneralPanelProvider';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Inventory valuation - Drawer Header - General panel.
 */
export default function InventoryValuationHeaderGeneralPanel() {
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
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterInventoryValuationOptions}
            label={<T id={'items.label_filter_items'} />}
            initialSelectedItem={'all-items'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup name={'itemsIds'} label={<T id={'Specific items'} />}>
            <ItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
