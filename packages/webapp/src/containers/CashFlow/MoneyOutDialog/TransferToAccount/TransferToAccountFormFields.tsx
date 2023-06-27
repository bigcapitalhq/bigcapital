// @ts-nocheck
import React from 'react';
import { FastField, Field, ErrorMessage, useFormikContext } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  AccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FieldRequiredHint,
  Icon,
  Col,
  Row,
  If,
  InputPrependButton,
  FeatureCan,
  BranchSelect,
  BranchSelectButton,
  ExchangeRateMutedField,
} from '@/components';
import { DateInput } from '@blueprintjs/datetime';
import { useAutofocus } from '@/hooks';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
  compose,
} from '@/utils';
import { Features } from '@/constants';
import { CLASSES } from '@/constants/classes';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import {
  useObserveTransactionNoSettings,
  useSetPrimaryBranchToForm,
  useForeignAccount,
  BranchRowDivider,
} from '../utils';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { MoneyInOutTransactionNoField } from '../../_components';

/**
 * Transfer to account form fields.
 */
export default function TransferToAccountFormFields() {
  // Money in dialog context.
  const { accounts, account, branches } = useMoneyOutDialogContext();
  const { values } = useFormikContext();
  const isForeignAccount = useForeignAccount();

  const accountRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FormGroup
              label={<T id={'branch'} />}
              className={classNames('form-group--select-list', Classes.FILL)}
            >
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                input={BranchSelectButton}
                popoverProps={{ minimal: true }}
              />
            </FormGroup>
          </Col>
        </Row>
        <BranchRowDivider />
      </FeatureCan>
      <Row>
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FastField name={'date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'date'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('date', formattedDate);
                  })}
                  value={transformDateValue(value)}
                  popoverProps={{
                    position: Position.BOTTOM,
                    minimal: true,
                  }}
                  intent={inputIntent({ error, touched })}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Transaction number -----------*/}
          <MoneyInOutTransactionNoField />
        </Col>
      </Row>
      {/*------------ amount -----------*/}
      <FastField name={'amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
            className={'form-group--amount'}
          >
            <ControlGroup>
              <InputPrependText text={account.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                inputRef={accountRef}
                intent={inputIntent({ error, touched })}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>
      <If condition={isForeignAccount}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={values?.currency_code}
          toCurrency={account?.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.date}
          exchangeRate={values.exchange_rate}
        />
      </If>
      <Row>
        <Col xs={5}>
          {/*------------ transfer from account -----------*/}
          <FastField name={'credit_account_id'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={
                  <T id={'cash_flow_transaction.label_transfer_to_account'} />
                }
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="credit_account_id" />}
                className={'form-group--credit_account_id'}
              >
                <AccountsSuggestField
                  accounts={accounts}
                  onAccountSelected={({ id }) =>
                    form.setFieldValue('credit_account_id', id)
                  }
                  filterByTypes={[
                    ACCOUNT_TYPE.CASH,
                    ACCOUNT_TYPE.BANK,
                    ACCOUNT_TYPE.CREDIT_CARD,
                  ]}
                  inputProps={{
                    intent: inputIntent({ error, touched }),
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FastField name={'reference_no'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'reference_no'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="reference_no" />}
                className={'form-group--reference-no'}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ description -----------*/}
      <FastField name={'description'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'description'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </React.Fragment>
  );
}
