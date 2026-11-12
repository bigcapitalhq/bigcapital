import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import {
  Col,
  CommercialDocHeader,
  CommercialDocTopHeader,
  DetailItem,
  DetailsMenu,
  ExchangeRateDetailItem,
  Row,
} from '@/components';
import { RecurringJournalStatus } from '@/ee/recurring-journals/containers/RecurringJournalsLanding/components';

/**
 * Recurring journal readonly details header.
 */
export function RecurringJournalDetailHeader() {
  const { recurringJournal } = useRecurringJournalDetailDrawerContext();

  if (!recurringJournal) {
    return null;
  }

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('recurring_journal.field.amount')}>
            <h3 className="big-number">
              {recurringJournal.amountFormatted ?? '--'}
            </h3>
          </AmountDetailItem>

          <StatusDetailItem label={''}>
            <RecurringJournalStatus
              status={recurringJournal.status}
              failureCount={recurringJournal.failureCount}
            />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('recurring_journal.field.profile_name')}
            >
              {recurringJournal.profileName}
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_journal.field.reference')}
              children={recurringJournal.reference || '--'}
            />

            <DetailItem label={intl.get('journal_type')}>
              {recurringJournal.journalType || '--'}
            </DetailItem>

            <DetailItem label={intl.get('accounting_basis_')}>
              {recurringJournal.basis
                ? intl.get(recurringJournal.basis)
                : intl.get('general')}
            </DetailItem>

            <DetailItem label={intl.get('currency')}>
              {recurringJournal.currencyCode || '--'}
            </DetailItem>

            <DetailItem label={intl.get('recurring_journal.field.frequency')}>
              {intl.get('recurring_journal.frequency_summary', {
                interval: recurringJournal.repeatInterval,
                frequency: intl.get(
                  `recurring_journal.frequency.${recurringJournal.frequency}`,
                ),
              })}
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_journal.field.start_date')}
              children={
                recurringJournal.startDateFormatted ||
                recurringJournal.startDate ||
                '--'
              }
            />

            <DetailItem
              label={intl.get('recurring_journal.field.end_date')}
              children={recurringJournal.endDateFormatted || '--'}
            />

            <ExchangeRateDetailItem
              exchangeRate={recurringJournal.exchangeRate}
              toCurrency={recurringJournal.currencyCode}
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
              label={intl.get('recurring_journal.field.next_journal_date')}
              children={recurringJournal.nextJournalDateFormatted || '--'}
            />

            <DetailItem
              label={intl.get('recurring_journal.field.last_journal_date')}
              children={recurringJournal.lastJournalDateFormatted || '--'}
            />

            <DetailItem
              label={intl.get('recurring_journal.details.occurrences_count')}
            >
              <strong>{recurringJournal.occurrencesCount ?? 0}</strong>
            </DetailItem>

            <DetailItem
              label={intl.get('recurring_journal.field.max_occurrences')}
              children={
                recurringJournal.maxOccurrences ??
                intl.get('recurring_journal.field.unlimited')
              }
            />

            <DetailItem
              label={intl.get('recurring_journal.field.auto_publish_short')}
              children={intl.get(recurringJournal.autoPublish ? 'yes' : 'no')}
            />

            <DetailItem
              label={intl.get('recurring_journal.field.created_at')}
              children={recurringJournal.createdAtFormatted || '--'}
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
