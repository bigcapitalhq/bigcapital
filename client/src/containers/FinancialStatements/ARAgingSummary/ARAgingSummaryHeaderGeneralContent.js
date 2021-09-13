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
} from 'components';
import { momentFormatter } from 'utils';
import { useARAgingSummaryGeneralContext } from './ARAgingSummaryGeneralProvider';

/**
 * AR Aging Summary - Drawer Header - General Fields.
 */
export default function ARAgingSummaryHeaderGeneralContent() {
  // AR Aging summary context.
  const { customers } = useARAgingSummaryGeneralContext();

  return (
    <div>
      <Row>
        <Col xs={5}>
          <FastField name={'asDate'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'as_date'} />}
                labelInfo={<FieldHint />}
                fill={true}
                intent={error && Intent.DANGER}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={value}
                  onChange={(selectedDate) => {
                    form.setFieldValue('asDate', selectedDate);
                  }}
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
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'aging_before_days'} />}
                labelInfo={<FieldHint />}
                className={'form-group--aging-before-days'}
                intent={error && Intent.DANGER}
              >
                <InputGroup
                  medium={true}
                  intent={error && Intent.DANGER}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FastField name={'agingPeriods'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'aging_periods'} />}
                labelInfo={<FieldHint />}
                className={'form-group--aging-periods'}
                intent={error && Intent.DANGER}
              >
                <InputGroup
                  medium={true}
                  intent={error && Intent.DANGER}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      <Row>
        <Col xs={5}>
          <Field name="customersIds">
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'specific_customers'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  contacts={customers}
                  contactsSelected={value}
                  onContactSelect={(contactsIds) => {
                    setFieldValue('customersIds', contactsIds);
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
