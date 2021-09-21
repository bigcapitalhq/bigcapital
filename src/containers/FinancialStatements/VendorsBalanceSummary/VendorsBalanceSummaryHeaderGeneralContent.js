import React from 'react';
import { Field, FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { FormGroup, Position, Classes, Checkbox } from '@blueprintjs/core';

import {
  ContactsMultiSelect,
  Row,
  Col,
  FieldHint,
  FormattedMessage as T,
} from '../../../components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';
import { useVendorsBalanceSummaryGeneralPanelContext } from './VendorsBalanceSummaryHeaderGeneralProvider';

/**
 * Vendors balance header - General panel - Content.
 */
export default function VendorsBalanceSummaryHeaderGeneralContent() {
  const { vendors } = useVendorsBalanceSummaryGeneralPanelContext();

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
        <Col xs={5}>
          <FastField name={'percentage'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'percentage_of_column'} />}
                  name={'percentage'}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <Field name={'vendorsIds'}>
            {({ form: { setFieldValue } }) => (
              <FormGroup
                label={<T id={'specific_vendors'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  items={vendors}
                  onItemSelect={(contacts) => {
                    const vendorsIds = contacts.map((contact) => contact.id);
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
