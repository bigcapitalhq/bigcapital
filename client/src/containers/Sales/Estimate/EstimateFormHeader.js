import React, { useCallback } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { FastField, ErrorMessage } from 'formik';
import { momentFormatter, compose, tansformDateValue, saveInvoke } from 'utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  Row,
  Col,
} from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { inputIntent, handleDateChange } from 'utils';
import { formatMessage } from 'services/intl';

function EstimateFormHeader({
  //#withCustomers
  customers,
  // #withDialogActions
  openDialog,
  // #ownProps
  onEstimateNumberChanged,
}) {
  const handleEstimateNumberChange = useCallback(() => {
    openDialog('estimate-number-form', {});
  }, [openDialog]);

  const handleEstimateNumberChanged = (event) => {
    saveInvoke(onEstimateNumberChanged, event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={'page-form__primary-section'}>
        {/* ----------- Customer name ----------- */}
        <FastField name={'customer_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'customer_name'} />}
              inline={true}
              className={classNames(
                CLASSES.FILL,
                'form-group--customer',
              )}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'customer_id'} />}
            >
              <ContactSelecetList
                contactsList={customers}
                selectedContactId={value}
                defaultSelectText={<T id={'select_customer_account'} />}
                onContactSelected={(customer) => {
                  form.setFieldValue('customer_id', customer.id);
                }}
              />
            </FormGroup>
          )}
        </FastField>

        <Row>
          <Col md={8} className={'col--estimate-date'}>
            {/* ----------- Estimate date ----------- */}
            <FastField name={'estimate_date'}>
              {({ form, field: { value }, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'estimate_date'} />}
                  inline={true}
                  labelInfo={<FieldRequiredHint />}
                  className={classNames(
                    CLASSES.FILL,
                    'form-group--estimate-date',
                  )}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name="estimate_date" />}
                >
                  <DateInput
                    {...momentFormatter('YYYY/MM/DD')}
                    value={tansformDateValue(value)}
                    onChange={handleDateChange((formattedDate) => {
                      form.setFieldValue('estimate_date', formatMessage);
                    })}
                    popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  />
                </FormGroup>
              )}
            </FastField>
          </Col>

          <Col md={4} className={'col--expiration-date'}>
            {/* ----------- Expiration date ----------- */}
            <FastField name={'expiration_date'}>
              {({ form, field: { value }, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'expiration_date'} />}
                  inline={true}
                  className={classNames(
                    CLASSES.FORM_GROUP_LIST_SELECT,
                    CLASSES.FILL,
                    'form-group--expiration-date',
                  )}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name="expiration_date" />}
                >
                  <DateInput
                    {...momentFormatter('YYYY/MM/DD')}
                    value={tansformDateValue(value)}
                    onChange={handleDateChange((formattedDate) => {
                      form.setFieldValue('expiration_date', formattedDate);
                    })}
                    popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  />
                </FormGroup>
              )}
            </FastField>
          </Col>
        </Row>

        {/* ----------- Estimate number ----------- */}
        <FastField name={'estimate_number'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'estimate'} />}
              inline={true}
              className={('form-group--estimate-number', CLASSES.FILL)}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="estimate_number" />}
            >
              <ControlGroup fill={true}>
                <InputGroup
                  minimal={true}
                  {...field}
                  onBlur={handleEstimateNumberChanged}
                />
                <InputPrependButton
                  buttonProps={{
                    onClick: handleEstimateNumberChange,
                    icon: <Icon icon={'settings-18'} />,
                  }}
                  tooltip={true}
                  tooltipProps={{
                    content: 'Setting your auto-generated estimate number',
                    position: Position.BOTTOM_LEFT,
                  }}
                />
              </ControlGroup>
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Reference ----------- */}
        <FastField name={'reference'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'reference'} />}
              inline={true}
              className={classNames('form-group--reference', CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="reference" />}
            >
              <InputGroup minimal={true} {...field} />
            </FormGroup>
          )}
        </FastField>
      </div>
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
  withDialogActions,
)(EstimateFormHeader);
