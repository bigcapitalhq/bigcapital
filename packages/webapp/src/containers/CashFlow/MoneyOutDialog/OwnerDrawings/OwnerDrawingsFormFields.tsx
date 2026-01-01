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
  FFormGroup,
  FTextArea,
  FInputGroup,
  FMoneyInputGroup,
  FDateInput,
} from '@/components';
import { CLASSES, Features, ACCOUNT_TYPE } from '@/constants';
import { momentFormatter } from '@/utils';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import {
  useSetPrimaryBranchToForm,
  BranchRowDivider,
} from '../../MoneyOutDialog/utils';
import { MoneyInOutTransactionNoField } from '../../_components';
import { useMoneyOutFieldsContext } from '../MoneyOutFieldsProvider';
import { MoneyOutExchangeRateField } from '../MoneyOutExchangeRateField';

/**
 * Owner drawings form fields.
 */
export default function OwnerDrawingsFormFields() {
  // Money out dialog context.
  const { accounts, branches } = useMoneyOutDialogContext();
  const { account } = useMoneyOutFieldsContext();

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
            name={'amount'}
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText text={account.currency_code} />
              <FMoneyInputGroup name={'amount'} minimal={true} />
            </ControlGroup>
          </FormGroup>
        </Col>
      </Row>

      {/*------------ Exchange rate -----------*/}
      <MoneyOutExchangeRateField />

      <Row>
        <Col xs={5}>
          {/*------------ equitty account -----------*/}
          <FFormGroup
            name={'credit_account_id'}
            label={<T id={'cash_flow_transaction.label_equity_account'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'credit_account_id'}
              items={accounts}
              filterByTypes={ACCOUNT_TYPE.EQUITY}
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

      {/*------------ description -----------*/}
      <FFormGroup name={'description'} label={<T id={'description'} />}>
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          fill={true}
        />
      </FFormGroup>
    </React.Fragment>
  );
}
