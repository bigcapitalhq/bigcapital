import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import {
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  CustomerDrawerLink,
  ExchangeRateDetailItem,
} from '@/components';
import { RecurringInvoiceStatus } from '@/containers/Sales/RecurringInvoices/RecurringInvoicesLanding/components';

/**
 * Recurring invoice readonly details header.
 */
export function RecurringInvoiceDetailHeader() {
  const { recurringInvoice } = useRecurringInvoiceDetailDrawerContext();

  if (!recurringInvoice) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('recurring_invoice.field.amount')}>
            <h3 className="big-number">{recurringInvoice.totalFormatted}</h3>
          </AmountDetailItem>

          <StatusDetailItem label={''}>
            <RecurringInvoiceStatus
              status={recurringInvoice.status}
              failureCount={recurringInvoice.failureCount}
            />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={recurringInvoice.customerId}>
                {recurringInvoice.customer?.displayName}
              </CustomerDrawerLink>
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_invoice.field.profile_name')}
            >
              {recurringInvoice.profileName}
            </DetailItem>

            <DetailItem
              label={intl.get('reference')}
              children={recurringInvoice.referenceNo || '--'}
            />

            <DetailItem label={intl.get('recurring_invoice.field.frequency')}>
              {intl.get('recurring_invoice.frequency_summary', {
                interval: recurringInvoice.repeatInterval,
                frequency: intl.get(
                  `recurring_invoice.frequency.${recurringInvoice.frequency}`,
                ),
              })}
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_invoice.field.start_date')}
              children={recurringInvoice.startDateFormatted || '--'}
            />

            <DetailItem
              label={intl.get('recurring_invoice.field.end_date')}
              children={recurringInvoice.endDateFormatted || '--'}
            />

            <ExchangeRateDetailItem
              exchangeRate={recurringInvoice?.exchangeRate}
              toCurrency={recurringInvoice?.currencyCode}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'180px'}
            textAlign={'right'}
          >
            <DetailItem
              label={intl.get('recurring_invoice.field.next_invoice_date')}
              children={recurringInvoice.nextInvoiceDateFormatted || '--'}
            />

            <DetailItem
              label={intl.get('recurring_invoice.field.last_invoice_date')}
              children={recurringInvoice.lastInvoiceDateFormatted || '--'}
            />

            <DetailItem
              label={intl.get('recurring_invoice.details.occurrences_count')}
            >
              <strong>{recurringInvoice.occurrencesCount ?? 0}</strong>
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_invoice.field.max_occurrences')}
              children={
                recurringInvoice.maxOccurrences ??
                intl.get('recurring_invoice.field.unlimited')
              }
            />

            <DetailItem
              label={intl.get('recurring_invoice.field.due_days')}
              children={recurringInvoice.dueDays}
            />

            <DetailItem
              label={intl.get('recurring_invoice.field.delivery_mode')}
              children={intl.get(
                `recurring_invoice.delivery_mode.${recurringInvoice.deliveryMode}`,
              )}
            />

            <DetailItem
              label={intl.get('recurring_invoice.field.created_at')}
              children={recurringInvoice.createdAtFormatted || '--'}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusDetailItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
  position: relative;
  top: -5px;
`;

const AmountDetailItem = styled(DetailItem)`
  width: 50%;
`;
