import React from 'react';
import { Field, FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { FormGroup, Position, Classes, Checkbox } from '@blueprintjs/core';
import { ContactsMultiSelect, FormattedMessage as T } from 'components';
import { Row, Col, FieldHint } from 'components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

/**
 * Vendors balance header -general panel.
 */
export default function VendorsBalanceSummaryHeaderGeneral() {
  const { vendors } = useVendorsBalanceSummaryContext();

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
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={<T id={'specific_vendors'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  onContactSelect={(contactsIds) => {
                    setFieldValue('vendorsIds', contactsIds);
                  }}
                  contacts={vendors}
                  contactsSelected={value}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
