// @ts-nocheck
import React from 'react';
import { FormGroup, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  FAccountsSuggestField,
  InputPrependText,
  FieldRequiredHint,
  Col,
  Row,
  FeatureCan,
  BranchSelect,
  BranchSelectButton,
  FMoneyInputGroup,
  FFormGroup,
  FTextArea,
  FDateInput,
  FInputGroup,
} from '@/components';
import { MoneyInOutTransactionNoField } from '../../_components';
import { MoneyInExchangeRateField } from '../MoneyInExchangeRateField';
import { CLASSES, ACCOUNT_TYPE, Features } from '@/constants';
import { momentFormatter } from '@/utils';
import { useMoneyInDailogContext } from '../MoneyInDialogProvider';
import { useMoneyInFieldsContext } from '../MoneyInFieldsProvider';
import {
  useSetPrimaryBranchToForm,
  BranchRowDivider,
} from '../../MoneyInDialog/utils';

/**
 * Transfer from account form fields.
 */
export default function TransferFromAccountFormFields() {
  // Money in dialog context.
  const { accounts, branches } = useMoneyInDailogContext();
  const { account } = useMoneyInFieldsContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup label={<T id={'branch'} />} name={'branch_id'}>
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                input={BranchSelectButton}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </Col>
        </Row>
        <BranchRowDivider />
      </FeatureCan>

      <Row>
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FFormGroup
            name={'date'}
            label={<T id={'date'} />}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FDateInput
              name={'date'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{
                position: Position.BOTTOM_LEFT,
                minimal: true,
              }}
            />
          </FFormGroup>
        </Col>
        <Col xs={5}>
          {/*------------ Transaction number -----------*/}
          <MoneyInOutTransactionNoField />
        </Col>
      </Row>
      {/*------------ Amount -----------*/}
      <Row>
        <Col xs={10}>
          <FormGroup
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText text={account.currency_code || '--'} />
              <FMoneyInputGroup name={'amount'} minimal={true} />
            </ControlGroup>
          </FormGroup>
        </Col>
      </Row>

      {/*------------ Exchange rate -----------*/}
      <MoneyInExchangeRateField />

      <Row>
        <Col xs={5}>
          {/*------------ Transfer from account -----------*/}
          <FFormGroup
            name={'credit_account_id'}
            label={
              <T id={'cash_flow_transaction.label_transfer_from_account'} />
            }
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'credit_account_id'}
              items={accounts as any[]}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.CREDIT_CARD,
              ]}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FFormGroup name={'reference_no'} label={<T id={'reference_no'} />}>
            <FInputGroup name={'reference_no'} />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Description -----------*/}
      <FormGroup name={'description'} label={<T id={'description'} />}>
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          fill={true}
        />
      </FormGroup>
    </React.Fragment>
  );
}
