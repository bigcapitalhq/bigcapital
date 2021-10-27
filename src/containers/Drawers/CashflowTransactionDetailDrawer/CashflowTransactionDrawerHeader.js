import React from 'react';
import { defaultTo } from 'lodash';
import {
  DetailsMenu,
  DetailItem,
  FormatDate,
  FormattedMessage as T,
} from 'components';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';

/**
 * Cashlflow transaction drawer detail Header.
 */
export default function CashflowTransactionDrawerHeader() {
  const {
    cashflowTransaction: {
      formatted_amount,
      transaction_type,
      transaction_number,
      reference_no,
      date,
      description,
    },
  } = useCashflowTransactionDrawerContext();

  return (
    <div className={'cashflow-drawer__content-header'}>
      <DetailsMenu>
        <DetailItem name={'total'} label={<T id={'total'} />}>
          <h3 class="amount">{formatted_amount}</h3>
        </DetailItem>

        <DetailItem
          name={'transaction_type'}
          label={<T id={'cash_flow_drawer.label_transaction_type'} />}
        >
          {transaction_type}
        </DetailItem>

        <DetailItem
          name={'transaction_number'}
          label={<T id={'cash_flow.drawer.label_transaction_no'} />}
        >
          {transaction_number}
        </DetailItem>
        <DetailItem
          label={<T id={'date'} />}
          children={<FormatDate value={date} />}
        />
        <DetailItem name={'reference-no'} label={<T id={'reference_no'} />}>
          {defaultTo(reference_no, '-')}
        </DetailItem>
      </DetailsMenu>

      <div class="cashflow-drawer__content-description">
        <b class="title">
          <T id={'description'} />
        </b>
        : {defaultTo(description, '—')}
      </div>
    </div>
  );
}
