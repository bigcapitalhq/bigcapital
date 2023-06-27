// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { DateInput } from '@blueprintjs/datetime';
import { isEqual } from 'lodash';
import {
  Icon,
  Col,
  Row,
  If,
  FieldRequiredHint,
  AccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FormattedMessage as T,
  ExchangeRateMutedField,
  BranchSelect,
  BranchSelectButton,
  FeatureCan,
} from '@/components';
import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
  compose,
} from '@/utils';
import { useAutofocus } from '@/hooks';
import { Features, ACCOUNT_TYPE } from '@/constants';
import { useSetPrimaryBranchToForm } from './utils';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Refund Vendor credit form fields.
 */
function RefundVendorCreditFormFields({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accounts, branches } = useRefundVendorCreditContext();
  const { values } = useFormikContext();

  const amountFieldRef = useAutofocus();

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
          {/* ------------- Refund date ------------- */}
          <FastField name={'refund_date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'refund_vendor_credit.dialog.refund_date'} />}
                labelInfo={<FieldRequiredHint />}
                className={classNames('form-group--select-list', CLASSES.FILL)}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="refund_date" />}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={transformDateValue(value)}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('refund_date', formattedDate);
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
          {/* ------------ Form account ------------ */}
          <FastField name={'deposit_account_id'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={
                  <T id={'refund_vendor_credit.dialog.deposit_to_account'} />
                }
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
                    ACCOUNT_TYPE.BANK,
                    ACCOUNT_TYPE.CASH,
                    ACCOUNT_TYPE.FIXED_ASSET,
                  ]}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      {/* ------------- Amount ------------- */}
      <FastField name={'amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'refund_vendor_credit.dialog.amount'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--amount', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
          >
            <ControlGroup>
              <InputPrependText text={values.currency_code} />
              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                intent={inputIntent({ error, touched })}
                inputRef={(ref) => (amountFieldRef.current = ref)}
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
          date={values.date}
          exchangeRate={values.exchange_rate}
        />
      </If>

      {/* ------------ Reference No. ------------ */}
      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference_no'} />}
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
      <FastField name={'description'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'refund_vendor_credit.dialog.description'} />}
            className={'form-group--description'}
          >
            <TextArea growVertically={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(withCurrentOrganization())(RefundVendorCreditFormFields);

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 13px;
`;
