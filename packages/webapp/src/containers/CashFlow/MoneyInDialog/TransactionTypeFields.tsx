// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  FAccountsSuggestField,
  FieldRequiredHint,
  Col,
  Row,
  FFormGroup,
  FSelect,
} from '@/components';
import { CLASSES, getAddMoneyInOptions } from '@/constants';

import { useMoneyInDailogContext } from './MoneyInDialogProvider';

/**
 * Transaction type fields.
 */
export default function TransactionTypeFields() {
  // Money in dialog context.
  const { cashflowAccounts, setAccountId } = useMoneyInDailogContext();

  // Retrieves the add money in button options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        <Col xs={5}>
          {/*------------ Transaction type -----------*/}
          <FFormGroup
            name={'transaction_type'}
            label={<T id={'transaction_type'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FSelect
              name={'transaction_type'}
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
            name={'cashflow_account_id'}
            label={<T id={'cash_flow_transaction.label_current_account'} />}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FAccountsSuggestField
              name={'cashflow_account_id'}
              items={cashflowAccounts}
              onItemSelect={({ id }) => {
                setAccountId(id);
              }}
            />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
