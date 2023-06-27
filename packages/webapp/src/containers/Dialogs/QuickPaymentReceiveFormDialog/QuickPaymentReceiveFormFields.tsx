// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { useAutofocus } from '@/hooks';
import { isEqual } from 'lodash';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES, Features, ACCOUNT_TYPE } from '@/constants';
import { DateInput } from '@blueprintjs/datetime';
import {
  Row,
  Col,
  FieldRequiredHint,
  FormattedMessage as T,
  AccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  Icon,
  If,
  FeatureCan,
  ExchangeRateMutedField,
  BranchSelect,
  BranchSelectButton,
} from '@/components';
import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
  compose,
} from '@/utils';
import { useSetPrimaryBranchToForm } from './utils';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withSettings from '@/containers/Settings/withSettings';

/**
 * Quick payment receive form fields.
 */
function QuickPaymentReceiveFormFields({
  paymentReceiveAutoIncrement,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accounts, branches, baseCurrency } = useQuickPaymentReceiveContext();

  // Intl context.
  const { values } = useFormikContext();

  const paymentReceiveFieldRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
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
          {/* ------------- Customer name ------------- */}
          <FastField name={'customer_id'}>
            {({ from, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'customer_name'} />}
                className={classNames('form-group--select-list', CLASSES.FILL)}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'customer_id'} />}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  minimal={true}
                  disabled={true}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/* ------------ Payment receive no. ------------ */}
          <FastField name={'payment_receive_no'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'payment_no'} />}
                labelInfo={<FieldRequiredHint />}
                className={('form-group--payment_receive_no', CLASSES.FILL)}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="payment_receive_no" />}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  minimal={true}
                  {...field}
                  disabled={paymentReceiveAutoIncrement}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ Amount Received -----------*/}
      <FastField name={'payment_amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'amount_received'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--payment_amount', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_amount" />}
          >
            <ControlGroup>
              <InputPrependText text={values.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('payment_amount', amount);
                }}
                intent={inputIntent({ error, touched })}
                inputRef={(ref) => (paymentReceiveFieldRef.current = ref)}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      <If condition={!isEqual(base_currency, values.currency_code)}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={base_currency}
          toCurrency={values.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.payment_date}
          exchangeRate={values.exchange_rate}
        />
      </If>

      <Row>
        <Col xs={5}>
          {/* ------------- Payment date ------------- */}
          <FastField name={'payment_date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'payment_date'} />}
                labelInfo={<FieldRequiredHint />}
                className={classNames('form-group--select-list', CLASSES.FILL)}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="payment_date" />}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={transformDateValue(value)}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('payment_date', formattedDate);
                  })}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  inputProps={{
                    leftIcon: <Icon icon={'date-range'} />,
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/* ------------ Deposit account ------------ */}
          <FastField name={'deposit_account_id'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'deposit_to'} />}
                className={classNames(
                  'form-group--deposit_account_id',
                  'form-group--select-list',
                  CLASSES.FILL,
                )}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'deposit_account_id'} />}
              >
                <AccountsSuggestField
                  selectedAccountId={value}
                  accounts={accounts}
                  onAccountSelected={({ id }) =>
                    form.setFieldValue('deposit_account_id', id)
                  }
                  inputProps={{
                    placeholder: intl.get('select_account'),
                  }}
                  filterByTypes={[
                    ACCOUNT_TYPE.CASH,
                    ACCOUNT_TYPE.BANK,
                    ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
                  ]}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/* ------------ Reference No. ------------ */}
      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* --------- Statement --------- */}
      <FastField name={'statement'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'statement'} />}
            className={'form-group--statement'}
          >
            <TextArea growVertically={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(QuickPaymentReceiveFormFields);

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;
`;
