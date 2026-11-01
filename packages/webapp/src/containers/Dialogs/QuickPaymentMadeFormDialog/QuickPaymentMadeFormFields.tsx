import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import type { QuickPaymentMadeFormValues } from './types';
import {
  FieldRequiredHint,
  Col,
  Row,
  FAccountsSuggestField,
  InputPrependText,
  Icon,
  If,
  FeatureCan,
  ExchangeRateMutedField,
  BranchSelect,
  FFormGroup,
  FInputGroup,
  FDateInput,
  FTextArea,
  FMoneyInputGroup,
} from '@/components';
import { CLASSES, ACCOUNT_TYPE, Features } from '@/constants';
import { useAutofocus, useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Quick payment made form fields.
 */
function QuickPaymentMadeFormFieldsInner(): React.ReactElement {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { accounts, branches } = useQuickPaymentMadeContext();

  // Intl context.
  const { values } = useFormikContext<QuickPaymentMadeFormValues>();

  const paymentMadeFieldRef = useAutofocus<HTMLInputElement>();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup label={intl.get('branch')} name={'branchId'}>
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
        {/* ------------- Vendor name ------------- */}
        <Col xs={5}>
          <FFormGroup name={'vendorId'} label={intl.get('vendor_name')}>
            <FInputGroup name={'vendorId'} disabled={true} />
          </FFormGroup>
        </Col>

        {/* ------------ Payment number. ------------ */}
        <Col xs={5}>
          <FFormGroup name={'paymentNumber'} label={intl.get('payment_no')}>
            <FInputGroup name={'paymentNumber'} />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Amount Received ----------- */}
      <FFormGroup name={'amount'} label={intl.get('amount_received')}>
        <ControlGroup>
          <InputPrependText text={values.currencyCode} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref: HTMLInputElement | null) => {
              paymentMadeFieldRef.current = ref;
            }}
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
          date={values.paymentDate}
          exchangeRate={values.exchangeRate}
        />
      </If>

      <Row>
        <Col xs={5}>
          {/* ------------- Payment date ------------- */}
          <FFormGroup
            name={'paymentDate'}
            label={intl.get('payment_date')}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
          >
            <FDateInput
              name={'paymentDate'}
              {...dateInputFormatter}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ payment account ------------ */}
          <FFormGroup
            name={'paymentAccountId'}
            label={intl.get('payment_account')}
          >
            <FAccountsSuggestField
              name={'paymentAccountId'}
              items={accounts ?? []}
              inputProps={{
                placeholder: intl.get('select_account'),
              }}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
            />
          </FFormGroup>
        </Col>
      </Row>

      {/* ------------ Reference No. ------------ */}
      <FFormGroup name={'reference'} label={intl.get('reference')}>
        <FInputGroup name={'reference'} />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup name={'statement'} label={intl.get('statement')}>
        <FTextArea name={'statement'} growVertically={true} fill={true} />
      </FFormGroup>
    </div>
  );
}

export const QuickPaymentMadeFormFields = QuickPaymentMadeFormFieldsInner;

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;

  .bp4-dark & {
    background: rgba(255, 255, 255, 0.1);
  }
`;
