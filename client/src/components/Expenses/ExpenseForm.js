import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  Position,
  Button,
  TextArea,
  ControlGroup
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { momentFormatter } from 'utils';
import moment from 'moment';
import AppToaster from 'components/AppToaster';

export default function ExpenseForm({
  accounts,
  editExpense,
  submitExpense,
  expenseDetails,
  currencies
}) {
  const {formatMessage} = useIntl();

  const [state, setState] = useState({
    selectedExpenseAccount: null,
    selectedPaymentAccount: null
  });
  const validationSchema = Yup.object().shape({
    date: Yup.date().required(),
    description: Yup.string().trim(),
    expense_account_id: Yup.number().required(),
    payment_account_id: Yup.number().required(),
    amount: Yup.number().required(),
    currency_code: Yup.string().required(),
    publish: Yup.boolean(),
    exchange_rate: Yup.number()
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      date: null
    },
    onSubmit: values => {
      submitExpense(values)
        .then(response => {
          AppToaster.show({
            message: 'the_expense_has_been_submit'
          });
        })
        .catch(error => {});
    }
  });

  // Account item of select accounts field.
  const accountItem = (item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick}
      />
    );
  };

  const onChangeAccount = () => {};

  const onChangePaymentAccount = () => {};

  const handleDateChange = date => {
    const formatted = moment(date).format('YYYY/MM/DD');
    formik.setFieldValue('date', formatted);
  };

  // Filters accounts items.
  const filterAccountsPredicater = (query, account, _index, exactMatch) => {
    const normalizedTitle = account.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  const onExpenseAccountSelect = account => {
    setState({ ...state, selectedExpenseAccount: account });
    formik.setFieldValue('expense_account_id', account.id);
  };

  const onChangePaymentAccountSelect = account => {
    setState({ ...state, selectedPaymentAccount: account });
    formik.setFieldValue('payment_account_id', account.id);
  };

  const onAmountCurrencySelect = currency => {
    formik.setFieldValue('currency_code', currency.id);
  };

  const paymentAccountLabel = state.selectedPaymentAccount
    ? state.selectedPaymentAccount.name
    : 'Select Payment Account';

  const expenseAccountLabel = state.selectedExpenseAccount
    ? state.selectedExpenseAccount.name
    : 'Select Expense Account';

  const handleClose = () => {};

  return (
    <div class='expense-form'>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          label={<T id={'date'}/>}
          inline={true}
          intent={formik.errors.date && Intent.DANGER}
          helperText={formik.errors.date && formik.errors.date}
        >
          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            defaultValue={new Date()}
            onChange={handleDateChange}
            popoverProps={{ position: Position.BOTTOM }}
          />
        </FormGroup>

        <FormGroup
          label={<T id={'expense_account'}/>}
          className={'form-group--expense-account'}
          inline={true}
          intent={formik.errors.expense_account_id && Intent.DANGER}
          helperText={
            formik.errors.expense_account_id && formik.errors.expense_account_id
          }
        >
          <Select
            items={accounts}
            itemRenderer={accountItem}
            itemPredicate={filterAccountsPredicater}
            popoverProps={{ minimal: true }}
            onItemSelect={onExpenseAccountSelect}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={expenseAccountLabel}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={<T id={'amount'}/>}
          className={'form-group--amount'}
          intent={formik.errors.amount && Intent.DANGER}
          helperText={formik.errors.amount && formik.errors.amount}
          inline={true}
        >
          <ControlGroup>
            <Select
              items={currencies.map(c => ({
                id: c.currency_code,
                name: c.currency_code
              }))}
              itemRenderer={accountItem}
              itemPredicate={filterAccountsPredicater}
              popoverProps={{ minimal: true }}
              onItemSelect={onAmountCurrencySelect}
            >
              <Button
                rightIcon='caret-down'
                text={formik.values.currency_code}
              />
            </Select>

            <InputGroup
              medium={true}
              intent={formik.errors.amount && Intent.DANGER}
              {...formik.getFieldProps('amount')}
            />
          </ControlGroup>
        </FormGroup>

        <FormGroup
          label={<T id={'exchange_rate'}/>}
          className={'form-group--exchange-rate'}
          inline={true}
        >
          <InputGroup />
        </FormGroup>

        <FormGroup
          label={<T id={'payment_account'}/>}
          className={'form-group--payment-account'}
          inline={true}
          intent={formik.errors.payment_account_id && Intent.DANGER}
          helperText={
            formik.errors.payment_account_id && formik.errors.payment_account_id
          }
        >
          <Select
            items={accounts}
            itemRenderer={accountItem}
            itemPredicate={filterAccountsPredicater}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangePaymentAccountSelect}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={paymentAccountLabel}
            />
          </Select>
        </FormGroup>

        <FormGroup
          label={<T id={'description'}/>}
          className={'form-group--description'}
          inline={true}
        >
          <TextArea
            growVertically={true}
            large={true}
            {...formik.getFieldProps('description')}
          />
        </FormGroup>

        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
        <T id={'save'}/>
          </Button>
          <Button><T id={'save_as_draft'}/></Button>
          <Button onClick={handleClose}><T id={'close'}/></Button>
        </div>
      </form>
    </div>
  );
}
