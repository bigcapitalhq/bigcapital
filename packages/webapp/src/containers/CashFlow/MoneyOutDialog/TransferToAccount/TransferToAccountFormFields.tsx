import { Position, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { MoneyInOutTransactionNoField } from '../../_components';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import { MoneyOutExchangeRateField } from '../MoneyOutExchangeRateField';
import { useMoneyOutFieldsContext } from '../MoneyOutFieldsProvider';
import { useSetPrimaryBranchToForm, BranchRowDivider } from '../utils';
import type { Account } from '@bigcapital/sdk-ts';
import {
  FormattedMessage as T,
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
import { Features } from '@/constants';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { momentFormatter } from '@/utils';

/**
 * Transfer to account form fields.
 */
export function TransferToAccountFormFields() {
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
            fastField
          >
            <FDateInput
              name={'date'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{
                position: Position.BOTTOM_LEFT,
                minimal: true,
              }}
              fastField
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
          <FFormGroup
            name={'amount'}
            label={intl.get('amount')}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText
                text={(account as Account | undefined)?.currencyCode}
              />
              <FMoneyInputGroup name={'amount'} minimal={true} fastField />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Exchange rate -----------*/}
      <MoneyOutExchangeRateField />

      <Row>
        <Col xs={5}>
          {/*------------ transfer from account -----------*/}
          <FFormGroup
            name={'creditAccountId'}
            label={<T id={'cash_flow_transaction.label_transfer_to_account'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'creditAccountId'}
              items={accounts}
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
          <FFormGroup name={'referenceNo'} label={intl.get('reference_no')}>
            <FInputGroup name={'referenceNo'} />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Description -----------*/}
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
