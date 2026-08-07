import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import { CreditNoteDetailsStatus } from './utils';
import {
  T,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';

/**
 * Credit note details drawer header.
 */
export function CreditNoteDetailHeader() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountItem label={intl.get('amount')}>
            <span className="big-number">{creditNote?.totalFormatted}</span>
          </AmountItem>

          <StatusItem>
            {creditNote && <CreditNoteDetailsStatus creditNote={creditNote} />}
          </StatusItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('credit_note.drawer.label_credit_note_date')}
            >
              {creditNote?.formattedCreditNoteDate}
            </DetailItem>

            <DetailItem
              label={intl.get('credit_note.drawer.label_credit_note_no')}
            >
              {defaultTo(creditNote?.creditNoteNumber, '-')}
            </DetailItem>

            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={creditNote?.customerId}>
                {creditNote?.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>
            <ExchangeRateDetailItem
              exchangeRate={creditNote?.exchangeRate}
              toCurrency={creditNote?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('credit_note.drawer.label_credits_remaining')}
            >
              <strong>{creditNote?.formattedCreditsRemaining}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(creditNote?.referenceNo, '-')}
            />
            <DetailItem
              label={intl.get('credit_note.drawer.label_created_at')}
              children={creditNote?.formattedCreatedAt}
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
