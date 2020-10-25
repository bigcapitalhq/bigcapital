import React, { useMemo, useCallback, useState } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import {
  ListSelect,
  ErrorMessage,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';

// import withCustomers from 'containers/Customers/withCustomers';
import withVendors from 'containers/Vendors/withVendors';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

function BillFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },

  //#withVendors
  vendorsCurrentPage,
  vendorItems,
  //#withAccouts
  accountsList,

  // #withDialog
  openDialog,
}) {
  const handleDateChange = useCallback(
    (date_filed) => (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue(date_filed, formatted);
    },
    [setFieldValue],
  );

  const onChangeSelected = useCallback(
    (filedName) => {
      return (item) => {
        setFieldValue(filedName, item.id);
      };
    },
    [setFieldValue],
  );

  const vendorNameRenderer = useCallback(
    (accept, { handleClick }) => (
      <MenuItem
        key={accept.id}
        text={accept.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  // Filter vendor name
  const filterVendorAccount = (query, vendor, _index, exactMatch) => {
    const normalizedTitle = vendor.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${vendor.display_name} ${normalizedTitle}`.indexOf(normalizedQuery) >=
        0
      );
    }
  };

  const handleBillNumberChange = useCallback(() => {
    openDialog('bill-number-form', {});
  }, [openDialog]);

  return (
    <div className="page-form page-form--bill">
      <div className={'page-form__primary-section'}>
        {/* Vendor  account name */}
        <FormGroup
          label={<T id={'vendor_name'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={errors.vendor_id && touched.vendor_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'vendor_id'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={vendorItems}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={vendorNameRenderer}
            itemPredicate={filterVendorAccount}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeSelected('vendor_id')}
            selectedItem={values.vendor_id}
            selectedItemProp={'id'}
            defaultText={<T id={'select_vendor_account'} />}
            labelProp={'display_name'}
          />
        </FormGroup>
        <Row>
          <Col>
            <FormGroup
              label={<T id={'bill_date'} />}
              inline={true}
              labelInfo={<FieldRequiredHint />}
              className={classNames('form-group--select-list', Classes.FILL)}
              intent={errors.bill_date && touched.bill_date && Intent.DANGER}
              helperText={
                <ErrorMessage name="bill_date" {...{ errors, touched }} />
              }
            >
              <DateInput
                {...momentFormatter('YYYY/MM/DD')}
                value={tansformDateValue(values.bill_date)}
                onChange={handleDateChange('bill_date')}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup
              label={<T id={'due_date'} />}
              inline={true}
              className={classNames('form-group--select-list', Classes.FILL)}
              intent={errors.due_date && touched.due_date && Intent.DANGER}
              helperText={
                <ErrorMessage name="due_date" {...{ errors, touched }} />
              }
            >
              <DateInput
                {...momentFormatter('YYYY/MM/DD')}
                value={tansformDateValue(values.due_date)}
                onChange={handleDateChange('due_date')}
                popoverProps={{ position: Position.BOTTOM, minimal: true }}
              />
            </FormGroup>
          </Col>
        </Row>
        {/* bill number */}
        <FormGroup
          label={<T id={'bill_number'} />}
          inline={true}
          className={('form-group--bill_number', Classes.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={errors.bill_number && touched.bill_number && Intent.DANGER}
          helperText={
            <ErrorMessage name="bill_number" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={errors.bill_number && touched.bill_number && Intent.DANGER}
            minimal={true}
            rightElement={
              <InputPrependButton
                buttonProps={{
                  onClick: handleBillNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated bill number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            }
            {...getFieldProps('bill_number')}
          />
        </FormGroup>
      </div>
      <FormGroup
        label={<T id={'reference'} />}
        inline={true}
        className={classNames('form-group--reference', Classes.FILL)}
        intent={errors.reference_no && touched.reference_no && Intent.DANGER}
        helperText={<ErrorMessage name="reference" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={errors.reference_no && touched.reference_no && Intent.DANGER}
          minimal={true}
          {...getFieldProps('reference_no')}
        />
      </FormGroup>
    </div>
  );
}

export default compose(
  withVendors(({ vendorsCurrentPage, vendorItems }) => ({
    vendorsCurrentPage,
    vendorItems,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withDialogActions,
)(BillFormHeader);
