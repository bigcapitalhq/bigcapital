import React from 'react';
import { defaultTo } from 'lodash';
import {
  DetailsMenu,
  DetailItem,
  FormatDate,
  FormattedMessage as T,
  Row,
  Col,
  CommercialDocTopHeader,
  CommercialDocHeader,
} from 'components';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';

/**
 * Cashlflow transaction drawer detail Header.
 */
export default function CashflowTransactionDrawerHeader() {
  const {
    cashflowTransaction: {
      formatted_amount,
      transaction_type_formatted,
      transaction_number,
      reference_no,
      date,
      description,
    },
  } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocHeader>
        <DetailsMenu>
          <DetailItem name={'total'} label={<T id={'total'} />}>
            <h3 class="amount">{formatted_amount}</h3>
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
              {transaction_type_formatted}
            </DetailItem>

            <DetailItem
              name={'transaction_number'}
              label={<T id={'cash_flow.drawer.label_transaction_no'} />}
            >
              {transaction_number}
            </DetailItem>

            <DetailItem label={<T id={'date'} />}>
              <FormatDate value={date} />
            </DetailItem>

            <DetailItem name={'reference-no'} label={<T id={'reference_no'} />}>
              {defaultTo(reference_no, '-')}
            </DetailItem>
          </DetailsMenu>
        </Col>
      </Row>

      {/* <div class="cashflow-drawer__content-description">
        <b class="title">
          <T id={'description'} />
        </b>
        : {defaultTo(description, '—')}
      </div> */}
    </CommercialDocHeader>
  );
}
