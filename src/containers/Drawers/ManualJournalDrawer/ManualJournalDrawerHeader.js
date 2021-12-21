import React from 'react';
import { defaultTo } from 'lodash';
import {
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  FormattedMessage as T,
} from 'components';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

/**
 * Manual journal details header.
 */
export default function ManualJournalDrawerHeader() {
  const {
    manualJournal: {
      formatted_amount,
      journal_type,
      journal_number,
      reference,
      currency_code,
      description,
    },
  } = useManualJournalDrawerContext();

  return (
    <div className={'journal-drawer__content-header'}>
      <DetailsMenu>
        <DetailItem name={'total'} label={<T id={'total'} />}>
          <h3 class="big-number">{formatted_amount}</h3>
        </DetailItem>
      </DetailsMenu>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem name={'journal-type'} label={<T id={'journal_type'} />}>
              {journal_type}
            </DetailItem>

            <DetailItem name={'journal-number'} label={<T id={'journal_no'} />}>
              {journal_number}
            </DetailItem>

            <DetailItem name={'reference-no'} label={<T id={'reference_no'} />}>
              {defaultTo(reference, '-')}
            </DetailItem>

            <DetailItem name={'currency'} label={<T id={'currency'} />}>
              {currency_code}
            </DetailItem>
          </DetailsMenu>
        </Col>
      </Row>

      <div class="journal-drawer__content-description">
        <b class="title">
          <T id={'manual_journal.details.description'} />
        </b>
        : {defaultTo(description, '—')}
      </div>
    </div>
  );
}
