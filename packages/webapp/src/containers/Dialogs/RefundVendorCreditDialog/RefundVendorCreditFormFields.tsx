// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { isEqual } from 'lodash';
import {
  Icon,
  Col,
  Row,
  If,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
  FMoneyInputGroup,
  FormattedMessage as T,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  FFormGroup,
  FDateInput,
  FInputGroup,
  FTextArea,
} from '@/components';
import { momentFormatter, compose } from '@/utils';
import { useAutofocus } from '@/hooks';
import { Features, ACCOUNT_TYPE } from '@/constants';
import { useSetPrimaryBranchToForm } from './utils';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';

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
            <FFormGroup name={'branch_id'} label={<T id={'branch'} />} fill>
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </Col>
        </Row>
        <BranchRowDivider />
      </FeatureCan>

      <Row>
        <Col xs={5}>
          {/* ------------- Refund date ------------- */}
          <FFormGroup
            name={'refund_date'}
            label={<T id={'refund_vendor_credit.dialog.refund_date'} />}
            labelInfo={<FieldRequiredHint />}
            fill
            fastField
          >
            <FDateInput
              name={'refund_date'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
              fastField
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Form account ------------ */}
          <FFormGroup
            name={'deposit_account_id'}
            label={<T id={'refund_vendor_credit.dialog.deposit_to_account'} />}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FAccountsSuggestField
              name={'deposit_account_id'}
              items={accounts}
              inputProps={{
                placeholder: intl.get('select_account'),
              }}
              filterByTypes={[
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.FIXED_ASSET,
              ]}
            />
          </FFormGroup>
        </Col>
      </Row>

      {/* ------------- Amount ------------- */}
      <FFormGroup
        name={'amount'}
        label={<T id={'refund_vendor_credit.dialog.amount'} />}
        labelInfo={<FieldRequiredHint />}
        fill
        fastField
      >
        <ControlGroup>
          <InputPrependText text={values.currency_code} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref) => (amountFieldRef.current = ref)}
            fastField
          />
        </ControlGroup>
      </FFormGroup>

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
      <FFormGroup
        name={'reference_no'}
        label={<T id={'reference_no'} />}
        fill
        fastField
      >
        <FInputGroup name={'reference_no'} minimal={true} fastField />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup name={'description'} fill fastField>
        <FTextArea name={'description'} growVertically={true} fastField />
      </FFormGroup>
    </div>
  );
}

export default compose(withCurrentOrganization())(RefundVendorCreditFormFields);

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 13px;
`;
