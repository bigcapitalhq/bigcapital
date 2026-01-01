// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { isEqual } from 'lodash';
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
import { CLASSES, Features } from '@/constants';
import { DateInput } from '@blueprintjs/datetime';
import {
  Icon,
  Col,
  Row,
  If,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FormattedMessage as T,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  FInputGroup,
  FMoneyInputGroup,
  FDateInput,
  FFormGroup,
  FTextArea,
} from '@/components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  compose,
} from '@/utils';
import { useAutofocus } from '@/hooks';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useSetPrimaryBranchToForm } from './utils';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';

import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';

/**
 * Refund credit note form fields.
 */
function RefundCreditNoteFormFields({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accounts, branches } = useRefundCreditNoteContext();
  const { values } = useFormikContext();

  const amountFieldRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup name={'branch_id'} label={<T id={'branch'} />}>
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
            name={'date'}
            label={<T id={'refund_credit_note.dialog.refund_date'} />}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FDateInput
              name={'date'}
              {...momentFormatter('YYYY/MM/DD')}
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
            name={'from_account_id'}
            label={<T id={'refund_credit_note.dialog.from_account'} />}
            labelInfo={<FieldRequiredHint />}
            fill
            fastField
          >
            <FAccountsSuggestField
              name={'from_account_id'}
              items={accounts}
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
        label={<T id={'refund_credit_note.dialog.amount'} />}
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

          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ exchange rate -----------*/}
      <If condition={!isEqual(base_currency, values.currency_code)}>
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
      <FFormGroup name={'reference_no'} label={<T id={'reference_no'} />} fill fastField>
        <FInputGroup name={'reference_no'} minimal fill />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup
        name={'description'}
        label={<T id={'refund_credit_note.dialog.description'} />}
        fill
        fastField
      >
        <FTextArea name={'description'} growVertically fill fastField />
      </FFormGroup>
    </div>
  );
}

export default compose(withCurrentOrganization())(RefundCreditNoteFormFields);

export const BranchRowDivider = styled.div`
  --x-divider-color: #ebf1f6;

  .bp4-dark & {
    --x-divider-color: rgba(255, 255, 255, 0.1);
  }
  height: 1px;
  background: var(--x-divider-color);
  margin-bottom: 13px;
`;
