import React from 'react';
import { FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { FastField, ErrorMessage } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { ContactSelecetList, FieldRequiredHint, Row, Col } from 'components';

import withVendors from 'containers/Vendors/withVendors';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

import {
  momentFormatter,
  compose,
  tansformDateValue,
  handleDateChange,
  inputIntent,
  saveInvoke,
} from 'utils';

/**
 * Fill form header.
 */
function BillFormHeader({
  onBillNumberChanged,

  //#withVendors
  vendorItems,
}) {
  const handleBillNumberBlur = (event) => {
    saveInvoke(onBillNumberChanged, event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={'page-form__primary-section'}>
        {/* ------- Vendor name ------ */}
        <FastField name={'vendor_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'vendor_name'} />}
              inline={true}
              className={classNames(CLASSES.FILL, 'form-group--vendor')}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'vendor_id'} />}
            >
              <ContactSelecetList
                contactsList={vendorItems}
                selectedContactId={value}
                defaultSelectText={<T id={'select_vender_account'} />}
                onContactSelected={(contact) => {
                  form.setFieldValue('vendor_id', contact.id);
                }}
              />
            </FormGroup>
          )}
        </FastField>

        <Row className={'row--bill-date'}>
          <Col md={7}>
            {/* ------- Bill date ------- */}
            <FastField name={'bill_date'}>
              {({ form, field: { value }, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'bill_date'} />}
                  inline={true}
                  labelInfo={<FieldRequiredHint />}
                  className={classNames(CLASSES.FILL)}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name="bill_date" />}
                >
                  <DateInput
                    {...momentFormatter('YYYY/MM/DD')}
                    value={tansformDateValue(value)}
                    onChange={handleDateChange((formattedDate) => {
                      form.setFieldValue('bill_date', formattedDate);
                    })}
                    popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  />
                </FormGroup>
              )}
            </FastField>
          </Col>

          <Col md={5}>
            {/* ------- Due date ------- */}
            <FastField name={'due_date'}>
              {({ form, field: { value }, meta: { error, touched } }) => (
                <FormGroup
                  label={<T id={'due_date'} />}
                  inline={true}
                  className={classNames(
                    'form-group--due-date',
                    'form-group--select-list',
                    CLASSES.FILL,
                  )}
                  intent={inputIntent({ error, touched })}
                  helperText={<ErrorMessage name="due_date" />}
                >
                  <DateInput
                    {...momentFormatter('YYYY/MM/DD')}
                    value={tansformDateValue(value)}
                    onChange={handleDateChange((formattedDate) => {
                      form.setFieldValue('due_date', formattedDate);
                    })}
                    popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  />
                </FormGroup>
              )}
            </FastField>
          </Col>
        </Row>

        {/* ------- Bill number ------- */}
        <FastField name={'bill_number'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'bill_number'} />}
              inline={true}
              className={('form-group--bill_number', CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="bill_number" />}
            >
              <InputGroup
                minimal={true}
                {...field}
                onBlur={handleBillNumberBlur}
              />
            </FormGroup>
          )}
        </FastField>

        {/* ------- Reference ------- */}
        <FastField name={'reference_no'}>
          {({ field, meta: { error, touched } }) => (
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
  withVendors(({ vendorItems }) => ({
    vendorItems,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withDialogActions,
)(BillFormHeader);
