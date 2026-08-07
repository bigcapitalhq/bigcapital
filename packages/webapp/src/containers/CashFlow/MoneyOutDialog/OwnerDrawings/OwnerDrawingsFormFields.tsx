import { FormGroup, Position, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { MoneyInOutTransactionNoField } from '../../_components';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import { MoneyOutExchangeRateField } from '../MoneyOutExchangeRateField';
import { useMoneyOutFieldsContext } from '../MoneyOutFieldsProvider';
import { useSetPrimaryBranchToForm, BranchRowDivider } from '../utils';
import type { Account } from '@bigcapital/sdk-ts';
import {
  FAccountsSuggestField,
  InputPrependText,
  FieldRequiredHint,
  Col,
  Row,
  FeatureCan,
  BranchSelect,
  FFormGroup,
  FTextArea,
  FInputGroup,
  FMoneyInputGroup,
  FDateInput,
} from '@/components';
import { Features, ACCOUNT_TYPE } from '@/constants';
import { momentFormatter } from '@/utils';

/**
 * Owner drawings form fields.
 */
export function OwnerDrawingsFormFields() {
  const { accounts, branches } = useMoneyOutDialogContext();
  const { account } = useMoneyOutFieldsContext();

  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
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
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FFormGroup
            name={'date'}
            label={intl.get('date')}
            labelInfo={<FieldRequiredHint />}
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
            label={intl.get('amount')}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText
                text={(account as Account | undefined)?.currencyCode}
              />
              <FMoneyInputGroup name={'amount'} minimal={true} fastField />
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
            name={'creditAccountId'}
            label={intl.get('cash_flow_transaction.label_equity_account')}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'creditAccountId'}
              items={accounts}
              filterByTypes={[ACCOUNT_TYPE.EQUITY]}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FFormGroup name={'referenceNo'} label={intl.get('reference_no')}>
            <FInputGroup name={'referenceNo'} />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ description -----------*/}
      <FFormGroup name={'description'} label={intl.get('description')}>
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
