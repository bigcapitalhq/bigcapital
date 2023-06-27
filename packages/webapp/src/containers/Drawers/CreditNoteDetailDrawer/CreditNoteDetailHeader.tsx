// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  FormatDate,
  T,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  ButtonLink,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

import { CreditNoteDetailsStatus } from './utils';

/**
 * Credit note details drawer header.
 */
export default function CreditNoteDetailHeader() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountItem label={intl.get('amount')}>
            <span class="big-number">{creditNote.formatted_amount}</span>
          </AmountItem>

          <StatusItem>
            <CreditNoteDetailsStatus creditNote={creditNote} />
          </StatusItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('credit_note.drawer.label_credit_note_date')}
            >
              <FormatDate value={creditNote.formatted_credit_note_date} />
            </DetailItem>

            <DetailItem
              label={intl.get('credit_note.drawer.label_credit_note_no')}
            >
              {defaultTo(creditNote.credit_note_number, '-')}
            </DetailItem>

            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={creditNote.customer_id}>
                {creditNote.customer?.display_name}
              </CustomerDrawerLink>
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={creditNote?.exchange_rate}
              toCurrency={creditNote?.currency_code}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizontal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('credit_note.drawer.label_credits_remaining')}
            >
              <strong>{creditNote.formatted_credits_remaining}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(creditNote.reference_no, '-')}
            />
            <DetailItem
              label={<T id={'credit_note.drawer.label_created_at'} />}
              children={<FormatDate value={creditNote.created_at} />}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
`;

const AmountItem = styled(DetailItem)`
  width: 50%;
`;
