import { Position, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { MoneyInOutTransactionNoField } from '../../_components';
import { useMoneyInDailogContext } from '../MoneyInDialogProvider';
import { MoneyInExchangeRateField } from '../MoneyInExchangeRateField';
import { useMoneyInFieldsContext } from '../MoneyInFieldsProvider';
import { useSetPrimaryBranchToForm, BranchRowDivider } from '../utils';
import type { Account } from '@bigcapital/sdk-ts';
import {
  FAccountsSuggestField,
  InputPrependText,
  FieldRequiredHint,
  Col,
  Row,
  BranchSelect,
  FeatureCan,
  FFormGroup,
  FMoneyInputGroup,
  FTextArea,
  FInputGroup,
  FDateInput,
  Icon,
} from '@/components';
import { ACCOUNT_TYPE, Features } from '@/constants';
import { momentFormatter } from '@/utils';

/**
 * Owner contribution form fields.
 */
export function OwnerContributionFormFields() {
  const { accounts, branches } = useMoneyInDailogContext();
  const { account } = useMoneyInFieldsContext();

  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
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
              inputProps={{
                fill: true,
                leftIcon: <Icon icon={'date-range'} />,
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
          <FFormGroup
            name={'amount'}
            label={intl.get('amount')}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText
                text={(account as Account | undefined)?.currencyCode || '--'}
              />
              <FMoneyInputGroup name={'amount'} minimal={true} fastField />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Exchange rate -----------*/}
      <MoneyInExchangeRateField />

      <Row>
        <Col xs={5}>
          {/*------------ equity account -----------*/}
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
