// @ts-nocheck
import React from 'react';
import { defaultTo } from 'lodash';
import {
  DetailsMenu,
  DetailItem,
  FormatDate,
  FormattedMessage as T,
  Row,
  Col,
  CommercialDocHeader,
} from '@/components';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';

/**
 * Cashflow transaction drawer detail Header.
 */
export default function CashflowTransactionDrawerHeader() {
  const { cashflowTransaction } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocHeader>
        <DetailsMenu>
          <DetailItem name={'total'} label={<T id={'total'} />}>
            <h3 class="big-number">{cashflowTransaction.formatted_amount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              name={'transaction_type'}
              label={<T id={'cash_flow_drawer.label_transaction_type'} />}
            >
              {cashflowTransaction.transaction_type_formatted}
            </DetailItem>

            <DetailItem
              name={'transaction_number'}
              label={<T id={'cash_flow.drawer.label_transaction_no'} />}
            >
              {cashflowTransaction.transaction_number}
            </DetailItem>

            <DetailItem label={<T id={'date'} />}>
              <FormatDate value={cashflowTransaction.date} />
            </DetailItem>

            <DetailItem name={'reference-no'} label={<T id={'reference_no'} />}>
              {defaultTo(cashflowTransaction.reference_no, '-')}
            </DetailItem>
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
