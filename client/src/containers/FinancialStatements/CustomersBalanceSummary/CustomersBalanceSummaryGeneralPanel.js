import React from 'react';
import { FastField, Field } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { Classes, FormGroup, Position, Checkbox } from '@blueprintjs/core';
import { ContactsMultiSelect, FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { Row, Col, FieldHint } from 'components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';

/**
 * Customers balance header - general panel.
 */
export default function CustomersBalanceSummaryGeneralPanel() {
  const { customers } = useCustomersBalanceSummaryContext();

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
                  name={'percentage'}
                  small={true}
                  label={<T id={'percentage_of_column'} />}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <Field name={'customersIds'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={<T id={'Specific customers'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  onContactSelect={(contactsIds) => {
                    setFieldValue('customersIds', contactsIds);
                  }}
                  contacts={customers}
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
