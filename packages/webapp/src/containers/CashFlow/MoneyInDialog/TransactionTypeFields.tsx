import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';
import {
  FAccountsSuggestField,
  FieldRequiredHint,
  Col,
  Row,
  FFormGroup,
  FSelect,
} from '@/components';
import { getAddMoneyInOptions } from '@/constants';

/**
 * Transaction type fields.
 */
export function TransactionTypeFields() {
  const { cashflowAccounts, setAccountId } = useMoneyInDailogContext();

  // Retrieves the add money in button options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        <Col xs={5}>
          {/*------------ Transaction type -----------*/}
          <FFormGroup
            name={'transactionType'}
            label={intl.get('transaction_type')}
            labelInfo={<FieldRequiredHint />}
          >
            <FSelect
              name={'transactionType'}
              items={addMoneyInOptions}
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
