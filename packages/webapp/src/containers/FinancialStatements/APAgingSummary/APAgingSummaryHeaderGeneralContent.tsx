// @ts-nocheck
import React from 'react';
import { FastField, Field } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import {
  Intent,
  FormGroup,
  InputGroup,
  Position,
  Classes,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  ContactsMultiSelect,
  Row,
  Col,
  FieldHint,
} from '@/components';
import { useAPAgingSummaryGeneralContext } from './APAgingSummaryGeneralProvider';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterVendorsOptions } from './constants';
import {
  momentFormatter,
  transformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

/**
 * AP Aging Summary - Drawer Header - General panel - Content.
 */
export default function APAgingSummaryHeaderGeneralContent() {
  const { vendors } = useAPAgingSummaryGeneralContext();

  return (
    <div>
      <Row>
        <Col xs={5}>
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
        <Col xs={5}>
          <FastField name={'agingDaysBefore'}>
            {({ field, meta: { error } }) => (
              <FormGroup
                label={<T id={'aging_before_days'} />}
                labelInfo={<FieldHint />}
                intent={inputIntent({ error })}
              >
                <InputGroup intent={error && Intent.DANGER} {...field} />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FastField name={'agingPeriods'}>
            {({ field, meta: { error } }) => (
              <FormGroup
                label={<T id={'aging_periods'} />}
                labelInfo={<FieldHint />}
                intent={inputIntent({ error })}
              >
                <InputGroup intent={error && Intent.DANGER} {...field} />
              </FormGroup>
            )}
          </FastField>
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
          <Field name={'vendorsIds'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'specific_vendors'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  items={vendors}
                  onItemSelect={(vendors) => {
                    const vendorsIds = vendors.map((customer) => customer.id);
                    setFieldValue('vendorsIds', vendorsIds);
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
