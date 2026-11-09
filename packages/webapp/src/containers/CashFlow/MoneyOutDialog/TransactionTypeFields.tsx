import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import {
  FAccountsSuggestField,
  FieldRequiredHint,
  Col,
  Row,
  FSelect,
  FFormGroup,
} from '@/components';
import { getAddMoneyOutOptions } from '@/constants/cashflowOptions';

/**
 * Transaction type fields.
 */
export function TransactionTypeFields() {
  const { cashflowAccounts } = useMoneyOutDialogContext();

  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  const { defaultAccountId, setAccountId } = useMoneyOutDialogContext();

  // Cannot continue if the default account id is defined.
  if (defaultAccountId) return null;

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        {/*------------ Transaction type -----------*/}
        <Col xs={5}>
          <FFormGroup
            name={'transactionType'}
            label={intl.get('transaction_type')}
            labelInfo={<FieldRequiredHint />}
          >
            <FSelect
              name={'transactionType'}
              items={addMoneyOutOptions}
              popoverProps={{ minimal: true }}
              valueAccessor={'value'}
              textAccessor={'name'}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/*------------ Current account -----------*/}
          <FFormGroup
            name={'cashflowAccountId'}
            label={intl.get('cash_flow_transaction.label_current_account')}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'cashflowAccountId'}
              items={cashflowAccounts}
              onItemChange={(value: string) => {
                setAccountId(Number(value));
              }}
            />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
