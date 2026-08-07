import { FormGroup, Position, Checkbox } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { filterVendorsOptions } from '../constants';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { useVendorsBalanceSummaryGeneralPanelContext } from './VendorsBalanceSummaryHeaderGeneralProvider';
import {
  Row,
  Col,
  FieldHint,
  FFormGroup,
  VendorsMultiSelect,
} from '@/components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

/**
 * Vendors balance header - General panel - Content.
 */
export function VendorsBalanceSummaryHeaderGeneralContent() {
  const { vendors } = useVendorsBalanceSummaryGeneralPanelContext();

  return (
    <div>
      <Row>
        <Col xs={5}>
          <FastField name={'asDate'}>
            {({
              form,
              field: { value },
              meta: { error },
            }: {
              form: any;
              field: { value: any };
              meta: { error: any };
            }) => (
              <FormGroup label={intl.get('as_date')} labelInfo={<FieldHint />}>
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  onChange={handleDateChange((selectedDate: Date) => {
                    form.setFieldValue('asDate', selectedDate);
                  })}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  fill={true}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FastField name={'percentage_column'} type={'checkbox'}>
            {({ field }: { field: any }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={intl.get('percentage_of_column')}
                  name={'percentage_column'}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterVendorsOptions}
            label={intl.get('vendors.label_filter_vendors')}
            initialSelectedItem={'with-transactions'}
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
