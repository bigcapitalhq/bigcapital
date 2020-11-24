import React, { useMemo, useCallback } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  ControlGroup,
} from '@blueprintjs/core';

import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { momentFormatter, compose, tansformDateValue, saveInvoke } from 'utils';
import {
  AccountsSelectList,
  ContactSelecetList,
  ErrorMessage,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  Hint,
  Money,
} from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

function PaymentReceiveFormHeader({
  // #useFormik
  errors,
  touched,
  setFieldValue,
  getFieldProps,
  values,
  onFullAmountChanged,
  paymentReceiveId,
  receivableFullAmount,
  amountReceived,

  //#withCustomers
  customers,

  //#withAccouts
  accountsList,

  // #withInvoices
  receivableInvoices,
  // #ownProps
  onPaymentReceiveNumberChanged,

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

  const onChangeSelect = useCallback(
    (filedName) => {
      return (item) => {
        setFieldValue(filedName, item.id);
      };
    },
    [setFieldValue],
  );

  const triggerFullAmountChanged = (value) => {
    onFullAmountChanged && onFullAmountChanged(value);
  };

  // Handle full amount changed event.
  const handleFullAmountBlur = (event) => {
    triggerFullAmountChanged(event.currentTarget.value);
  };
  // Handle link click of receive full amount.
  const handleReceiveFullAmountClick = () => {
    setFieldValue('full_amount', receivableFullAmount);
    triggerFullAmountChanged(receivableFullAmount);
  };

  const handlePaymentReceiveNumberChange = useCallback(() => {
    openDialog('payment-receive-number-form', {});
  }, [openDialog]);

  const handlePaymentReceiveNumberChanged = (event) => {
    saveInvoke(onPaymentReceiveNumberChanged, event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
          {/* ------------- Customer name ------------- */}
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={errors.customer_id && touched.customer_id && Intent.DANGER}
            helperText={
              <ErrorMessage name={'customer_id'} {...{ errors, touched }} />
            }
          >
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={values.customer_id}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={onChangeSelect('customer_id')}
              popoverFill={true}
            />
          </FormGroup>

          {/* ------------- Payment date ------------- */}
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            intent={
              errors.payment_date && touched.payment_date && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="payment_date" {...{ errors, touched }} />
            }
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.payment_date)}
              onChange={handleDateChange('payment_date')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>

          {/* ------------ Full amount ------------ */}
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', CLASSES.FILL)}
            intent={errors.full_amount && touched.full_amount && Intent.DANGER}
            labelInfo={<Hint />}
            helperText={
              <ErrorMessage name="full_amount" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.full_amount && touched.full_amount && Intent.DANGER
              }
              minimal={true}
              value={values.full_amount}
              {...getFieldProps('full_amount')}
              onBlur={handleFullAmountBlur}
            />

            <a
              onClick={handleReceiveFullAmountClick}
              href="#"
              className={'receive-full-amount'}
            >
              Receive full amount (
              <Money amount={receivableFullAmount} currency={'USD'} />)
            </a>
          </FormGroup>

          {/* ------------ Payment receive no. ------------ */}
          <FormGroup
            label={<T id={'payment_receive_no'} />}
            inline={true}
            className={('form-group--payment_receive_no', CLASSES.FILL)}
            intent={
              errors.payment_receive_no &&
              touched.payment_receive_no &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                name="payment_receive_no"
                {...{ errors, touched }}
              />
            }
          >
            <ControlGroup fill={true}>
              <InputGroup
                intent={
                  errors.payment_receive_no &&
                  touched.payment_receive_no &&
                  Intent.DANGER
                }
                minimal={true}
                {...getFieldProps('payment_receive_no')}
                onBlur={handlePaymentReceiveNumberChanged}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handlePaymentReceiveNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated Payment Receive number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>

          {/* ------------ Deposit account ------------ */}
          <FormGroup
            label={<T id={'deposit_to'} />}
            className={classNames(
              'form-group--deposit_account_id',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={
              errors.deposit_account_id &&
              touched.deposit_account_id &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                name={'deposit_account_id'}
                {...{ errors, touched }}
              />
            }
          >
            <AccountsSelectList
              accounts={accountsList}
              labelInfo={<FieldRequiredHint />}
              onAccountSelected={onChangeSelect('deposit_account_id')}
              defaultSelectText={<T id={'select_deposit_account'} />}
              selectedAccountId={values.deposit_account_id}
              filterByTypes={['current_asset']}
            />
          </FormGroup>

          {/* ------------ Reference No. ------------ */}
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={
              errors.reference_no && touched.reference_no && Intent.DANGER
            }
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

        <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
          <div class="big-amount">
            <span class="big-amount__label">Amount Received</span>
            <h1 class="big-amount__number">
              <Money amount={amountReceived} currency={'USD'} />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withDialogActions,
)(PaymentReceiveFormHeader);
