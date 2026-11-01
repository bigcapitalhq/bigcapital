import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import type { RefundVendorCreditFormValues } from './types';
import {
  Icon,
  Col,
  Row,
  If,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
  FMoneyInputGroup,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  FDateInput,
  FInputGroup,
  FTextArea,
  FFormGroup,
} from '@/components';
import { Features, ACCOUNT_TYPE } from '@/constants';
import { useAutofocus, useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Refund Vendor credit form fields.
 */
function RefundVendorCreditFormFieldsInner(): React.ReactElement {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const { accounts, branches } = useRefundVendorCreditContext();
  const { values } = useFormikContext<RefundVendorCreditFormValues>();

  const amountFieldRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup name={'branchId'} label={intl.get('branch')}>
              <BranchSelect
                name={'branchId'}
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
            name={'refundDate'}
            label={intl.get('refund_vendor_credit.dialog.refund_date')}
            labelInfo={<FieldRequiredHint />}
            fastField
          >
            <FDateInput
              name={'refundDate'}
              {...dateInputFormatter}
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
            name={'depositAccountId'}
            label={intl.get('refund_vendor_credit.dialog.deposit_to_account')}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'depositAccountId'}
              items={accounts ?? []}
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
        label={intl.get('refund_vendor_credit.dialog.amount')}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <ControlGroup>
          <InputPrependText text={values.currencyCode} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref: HTMLInputElement | null) => {
              amountFieldRef.current = ref;
            }}
            fastField
          />
        </ControlGroup>
      </FFormGroup>

      <If condition={!isEqual(baseCurrency, values.currencyCode)}>
        {/*------------ exchange rate ----------- */}
        <ExchangeRateMutedField
          name={'exchangeRate'}
          fromCurrency={baseCurrency}
          toCurrency={values.currencyCode}
          formGroupProps={{ label: '', inline: false }}
          date={values.date}
          exchangeRate={values.exchangeRate}
        />
      </If>

      {/* ------------ Reference No. ------------ */}
      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference_no')}
        fastField
      >
        <FInputGroup name={'referenceNo'} fastField />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup
        name={'description'}
        label={intl.get('refund_vendor_credit.dialog.description')}
        fastField
      >
        <FTextArea name={'description'} growVertically fill fastField />
      </FFormGroup>
    </div>
  );
}

export const RefundVendorCreditFormFields = RefundVendorCreditFormFieldsInner;

export const BranchRowDivider = styled.div`
  --x-divider-color: #ebf1f6;

  .bp4-dark & {
    --x-divider-color: rgba(255, 255, 255, 0.1);
  }
  height: 1px;
  background: var(--x-divider-color);
  margin-bottom: 13px;
`;
