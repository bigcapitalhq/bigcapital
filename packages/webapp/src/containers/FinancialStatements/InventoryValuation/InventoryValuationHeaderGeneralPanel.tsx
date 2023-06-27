// @ts-nocheck
import React from 'react';
import { FastField, Field } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { FormGroup, Position, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import {
  FormattedMessage as T,
  ItemsMultiSelect,
  Row,
  Col,
  FieldHint,
} from '@/components';
import { filterInventoryValuationOptions } from '../constants';

import {
  momentFormatter,
  transformDateValue,
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
                  value={transformDateValue(value)}
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
          <Field name={'itemsIds'}>
            {({ form: { setFieldValue } }) => (
              <FormGroup
                label={<T id={'Specific items'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ItemsMultiSelect
                  items={items}
                  onItemSelect={(items) => {
                    const itemsIds = items.map((item) => item.id);
                    setFieldValue('itemsIds', itemsIds);
                  }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
