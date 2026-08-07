import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';
import { ManualJournalDetailsStatus } from './utils';
import {
  Row,
  Col,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
} from '@/components';

/**
 * Manual journal details header.
 */
export function ManualJournalDrawerHeader() {
  const { manualJournal } = useManualJournalDrawerContext();

  if (!manualJournal) return null;

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem name={'total'} label={intl.get('total')}>
            <h3 className="big-number">{manualJournal.formattedAmount}</h3>
          </DetailItem>

          <StatusDetailItem>
            <ManualJournalDetailsStatus manualJournal={manualJournal} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem name={'journal-type'} label={intl.get('journal_type')}>
              {manualJournal.journalType}
            </DetailItem>

            <DetailItem name={'journal-number'} label={intl.get('journal_no')}>
              {manualJournal.journalNumber}
            </DetailItem>

            <DetailItem name={'reference-no'} label={intl.get('reference_no')}>
              {defaultTo(manualJournal.reference, '-')}
            </DetailItem>

            <DetailItem name={'currency'} label={intl.get('currency')}>
              {manualJournal.currencyCode}
            </DetailItem>

            <DetailItem label={intl.get('description')}>
              {defaultTo(manualJournal.description, '—')}
            </DetailItem>
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
