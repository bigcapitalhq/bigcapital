import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import type { RefundCreditNoteFormValues } from './types';
import {
  Icon,
  Col,
  Row,
  If,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  FInputGroup,
  FMoneyInputGroup,
  FDateInput,
  FFormGroup as FFormGroupBase,
  FTextArea,
} from '@/components';
import { Features } from '@/constants';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useAutofocus, useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

// FFormGroup / FMoneyInputGroup / FInputGroup (blueprintjs-formik) wrappers
// don't expose all underlying props (`fill`, `minimal`) in their public type.
// Widen locally — runtime passes extras through.
type FFormGroupProps = React.PropsWithChildren<{
  name?: string;
  label?: React.ReactNode;
  labelInfo?: React.ReactNode;
  className?: string;
  inline?: boolean;
  fill?: boolean;
  fastField?: boolean;
}>;
const FFormGroup = FFormGroupBase as unknown as React.FC<FFormGroupProps>;

type FInputProps = {
  name?: string;
  minimal?: boolean;
  fill?: boolean;
  fastField?: boolean;
  inputRef?: (ref: HTMLInputElement | null) => void;
};
const FInputGroupWidened = FInputGroup as unknown as React.FC<FInputProps>;
const FMoneyInputGroupWidened =
  FMoneyInputGroup as unknown as React.FC<FInputProps>;

/**
 * Refund credit note form fields.
 */
function RefundCreditNoteFormFieldsInner(): React.ReactElement {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const { accounts, branches } = useRefundCreditNoteContext();
  const { values } = useFormikContext<RefundCreditNoteFormValues>();

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
            name={'date'}
            label={intl.get('refund_credit_note.dialog.refund_date')}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FDateInput
              name={'date'}
              {...dateInputFormatter}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Form account ------------ */}
          <FFormGroup
            name={'fromAccountId'}
            label={intl.get('refund_credit_note.dialog.from_account')}
            labelInfo={<FieldRequiredHint />}
            fill
            fastField
          >
            <FAccountsSuggestField
              name={'fromAccountId'}
              items={accounts ?? []}
              inputProps={{
                placeholder: intl.get('select_account'),
              }}
              filterByTypes={[
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.FIXED_ASSET,
              ]}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      {/* ------------- Amount ------------- */}
      <FFormGroup
        name={'amount'}
        label={intl.get('refund_credit_note.dialog.amount')}
        labelInfo={<FieldRequiredHint />}
        fill
        fastField
      >
        <ControlGroup>
          <InputPrependText text={values.currencyCode} />
          <FMoneyInputGroupWidened
            name={'amount'}
            minimal={true}
            inputRef={(ref: HTMLInputElement | null) => {
              amountFieldRef.current = ref;
            }}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ exchange rate ----------- */}
      <If condition={!isEqual(baseCurrency, values.currencyCode)}>
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
        fill
        fastField
      >
        <FInputGroupWidened name={'referenceNo'} minimal fill />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup
        name={'description'}
        label={intl.get('refund_credit_note.dialog.description')}
        fill
        fastField
      >
        <FTextArea name={'description'} growVertically fill fastField />
      </FFormGroup>
    </div>
  );
}

export const RefundCreditNoteFormFields = RefundCreditNoteFormFieldsInner;

export const BranchRowDivider = styled.div`
  --x-divider-color: #ebf1f6;

  .bp4-dark & {
    --x-divider-color: rgba(255, 255, 255, 0.1);
  }
  height: 1px;
  background: var(--x-divider-color);
  margin-bottom: 13px;
`;
