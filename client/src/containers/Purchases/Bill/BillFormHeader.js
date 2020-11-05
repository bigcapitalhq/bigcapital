import React, { useCallback } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  ContactSelecetList,
  ErrorMessage,
  FieldRequiredHint,
  Row,
  Col,
} from 'components';

// import withCustomers from 'containers/Customers/withCustomers';
import withVendors from 'containers/Vendors/withVendors';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

function BillFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },
  onBillNumberChanged,

  //#withVendors
  vendorItems,
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

  const handleBillNumberBlur = (event) => {
    onBillNumberChanged && onBillNumberChanged(event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={'page-form__primary-section'}>
        {/* Vendor name */}
        <FormGroup
          label={<T id={'vendor_name'} />}
          inline={true}
          className={classNames(
            'form-group--select-list',
            'form-group--vendor',
            CLASSES.FILL,
          )}
          labelInfo={<FieldRequiredHint />}
          intent={errors.vendor_id && touched.vendor_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'vendor_id'} {...{ errors, touched }} />
          }
        >
          <ContactSelecetList
            contactsList={vendorItems}
            selectedContactId={values.vendor_id}
            defaultSelectText={ <T id={'select_vender_account'} /> }
            onContactSelected={onChangeSelected('vendor_id')}
          />
        </FormGroup>

        <Row className={'row--bill-date'}>
          <Col md={7}>
            {/* Bill date */}
            <FormGroup
              label={<T id={'bill_date'} />}
              inline={true}
              labelInfo={<FieldRequiredHint />}
              className={classNames('form-group--select-list', CLASSES.FILL)}
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

          <Col md={5}>
            {/* Due date */}
            <FormGroup
              label={<T id={'due_date'} />}
              inline={true}
              className={classNames(
                'form-group--due-date',
                'form-group--select-list',
                CLASSES.FILL,
              )}
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

        {/* Bill number */}
        <FormGroup
          label={<T id={'bill_number'} />}
          inline={true}
          className={('form-group--bill_number', CLASSES.FILL)}
          intent={errors.bill_number && touched.bill_number && Intent.DANGER}
          helperText={
            <ErrorMessage name="bill_number" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={errors.bill_number && touched.bill_number && Intent.DANGER}
            minimal={true}
            {...getFieldProps('bill_number')}
            onBlur={handleBillNumberBlur}
          />
        </FormGroup>

        {/* Reference */}
        <FormGroup
          label={<T id={'reference'} />}
          inline={true}
          className={classNames('form-group--reference', CLASSES.FILL)}
          intent={errors.reference_no && touched.reference_no && Intent.DANGER}
          helperText={
            <ErrorMessage name="reference" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={
              errors.reference_no && touched.reference_no && Intent.DANGER
            }
            minimal={true}
            {...getFieldProps('reference_no')}
          />
        </FormGroup>
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
