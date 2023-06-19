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
  Col,
  Row,
  If,
  ExchangeRateMutedField,
  BranchSelect,
  BranchSelectButton,
  FeatureCan,
} from '@/components';
import { DateInput } from '@blueprintjs/datetime';
import { useAutofocus } from '@/hooks';
import { ACCOUNT_TYPE, CLASSES, Features } from '@/constants';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from '@/utils';
import { useMoneyInDialogContext } from '../MoneyInDialogProvider';
import {
  useSetPrimaryBranchToForm,
  useForeignAccount,
  BranchRowDivider,
} from '../../MoneyInDialog/utils';
import { MoneyInOutTransactionNoField } from '../../_components';

/**
/**
 * Owner contribution form fields.
 */
export default function OwnerContributionFormFields() {
  // Money in dialog context.
  const { accounts, account, branches } = useMoneyInDialogContext();

  const { values } = useFormikContext();

  const amountFieldRef = useAutofocus();

  const isForeignAccount = useForeignAccount();

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
                  value={tansformDateValue(value)}
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
      <Field name={'amount'}>
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
              <InputPrependText text={account?.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                inputRef={(ref) => (amountFieldRef.current = ref)}
                intent={inputIntent({ error, touched })}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </Field>
      <If condition={isForeignAccount}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={values.currency_code}
          toCurrency={account.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.date}
          exchangeRate={values.exchange_rate}
        />
      </If>
      <Row>
        <Col xs={5}>
          {/*------------ equity account -----------*/}
          <FastField name={'credit_account_id'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'cash_flow_transaction.label_equity_account'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="credit_account_id" />}
                className={'form-group--credit_account_id'}
              >
                <AccountsSuggestField
                  accounts={accounts}
                  onAccountSelected={(account) => {
                    form.setFieldValue('credit_account_id', account.id);
                    form.setFieldValue('currency_code', account.currency_code);
                  }}
                  filterByTypes={ACCOUNT_TYPE.EQUITY}
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
