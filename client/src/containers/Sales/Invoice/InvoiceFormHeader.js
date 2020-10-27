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

import withCustomers from 'containers/Customers/withCustomers';
import withDialogActions from 'containers/Dialog/withDialogActions';

function InvoiceFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },

  //#withCustomers
  customers,
  //#withDialogActions
  openDialog,
}) {
  const handleDateChange = useCallback(
    (date_filed) => (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue(date_filed, formatted);
    },
    [setFieldValue],
  );

  const CustomerRenderer = useCallback(
    (cutomer, { handleClick }) => (
      <MenuItem
        key={cutomer.id}
        text={cutomer.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  // Filter Customer
  const filterCustomer = (query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${customer.display_name} ${normalizedTitle}`.indexOf(
          normalizedQuery,
        ) >= 0
      );
    }
  };

  // handle change customer
  const onChangeCustomer = useCallback(
    (filedName) => {
      return (customer) => {
        setFieldValue(filedName, customer.id);
      };
    },
    [setFieldValue],
  );

  const handleInvoiceNumberChange = useCallback(() => {
    openDialog('invoice-number-form', {});
  }, [openDialog]);

  return (
    <div class="page-form page-form--invoice">
      <div className={'page-form__primary-section'}>
        {/* customer name */}
        <FormGroup
          label={<T id={'customer_name'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={errors.customer_id && touched.customer_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'customer_id'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={customers}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={CustomerRenderer}
            itemPredicate={filterCustomer}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeCustomer('customer_id')}
            selectedItem={values.customer_id}
            selectedItemProp={'id'}
            defaultText={<T id={'select_customer_account'} />}
            labelProp={'display_name'}
          />
        </FormGroup>
      </div>

      <Row>
        <Col>
          <FormGroup
            label={<T id={'invoice_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={
              errors.invoice_date && touched.invoice_date && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="invoice_date" {...{ errors, touched }} />
            }
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.invoice_date)}
              onChange={handleDateChange('invoice_date')}
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
      {/* invoice */}
      <FormGroup
        label={<T id={'invoice_no'} />}
        inline={true}
        className={('form-group--estimate', Classes.FILL)}
        labelInfo={<FieldRequiredHint />}
        intent={errors.invoice_no && touched.invoice_no && Intent.DANGER}
        helperText={<ErrorMessage name="invoice_no" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={errors.invoice_no && touched.invoice_no && Intent.DANGER}
          minimal={true}
          {...getFieldProps('invoice_no')}
        />
      </FormGroup>

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
  withCustomers(({ customers }) => ({
    customers,
  })),
  withDialogActions,
)(InvoiceFormHeader);
