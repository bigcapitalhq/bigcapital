// @ts-nocheck
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import {
  DetailsMenu,
  DetailItem,
  FormatDate,
  Row,
  Col,
  CommercialDocHeader,
} from '@/components';

/**
 * Cashlflow transaction drawer detail Header.
 */
export function CashflowTransactionDrawerHeader() {
  const { cashflowTransaction } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocHeader>
        <DetailsMenu>
          <DetailItem name={'total'} label={intl.get('total')}>
            <h3 class="big-number">{cashflowTransaction.formattedAmount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              name={'transaction_type'}
              label={intl.get('cash_flow_drawer.label_transaction_type')}
            >
              {cashflowTransaction.transactionTypeFormatted}
            </DetailItem>

            <DetailItem
              name={'transaction_number'}
              label={intl.get('cash_flow.drawer.label_transaction_no')}
            >
              {cashflowTransaction.transactionNumber}
            </DetailItem>

            <DetailItem label={intl.get('date')}>
              {cashflowTransaction.formattedDate}
            </DetailItem>

            <DetailItem name={'reference-no'} label={intl.get('reference_no')}>
              {defaultTo(cashflowTransaction.referenceNo, '-')}
            </DetailItem>
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
