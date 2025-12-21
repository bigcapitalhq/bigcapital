// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  FAccountsSuggestField,
  FieldRequiredHint,
  Col,
  Row,
  FSelect,
  FFormGroup,
} from '@/components';
import { getAddMoneyOutOptions } from '@/constants/cashflowOptions';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import { CLASSES } from '@/constants/classes';

/**
 * Transaction type fields.
 */
function TransactionTypeFields() {
  // Money in dialog context.
  const { cashflowAccounts } = useMoneyOutDialogContext();

  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  // Money in dialog context.
  const { defaultAccountId, setAccountId } = useMoneyOutDialogContext();

  // Cannot continue if the default account id is defined.
  if (defaultAccountId) return null;

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        {/*------------ Transaction type -----------*/}
        <Col xs={5}>
          <FFormGroup
            name={'transaction_type'}
            label={<T id={'transaction_type'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FSelect
              name={'transaction_type'}
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

export default TransactionTypeFields;
