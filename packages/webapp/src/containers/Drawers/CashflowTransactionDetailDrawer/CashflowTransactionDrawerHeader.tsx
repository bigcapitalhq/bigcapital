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
            <h3 class="big-number">{cashflowTransaction.formatted_amount}</h3>
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
              {cashflowTransaction.transaction_type_formatted}
            </DetailItem>

            <DetailItem
              name={'transaction_number'}
              label={intl.get('cash_flow.drawer.label_transaction_no')}
            >
              {cashflowTransaction.transaction_number}
            </DetailItem>

            <DetailItem label={intl.get('date')}>
              {cashflowTransaction.formatted_date}
            </DetailItem>

            <DetailItem name={'reference-no'} label={intl.get('reference_no')}>
              {defaultTo(cashflowTransaction.reference_no, '-')}
            </DetailItem>
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
