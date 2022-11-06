// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';
import {
  TRDarkSingleLine,
  TRDarkDoubleLines,
  T,
  FormatNumber,
  Table,
  TD,
} from '@/components';

/**
 * Manual journal readonly details footer.
 */
export default function ManualJournalDrawerFooter() {
  const {
    manualJournal: { amount, formatted_amount },
  } = useManualJournalDrawerContext();

  return (
    <div className="journal-drawer__content-footer">
      <JournalTotalTable>
        <TRDarkSingleLine>
          <TDLabel>
            <T id={'manual_journal.details.subtotal'} />
          </TDLabel>
          <TDAmount textAlign={'right'}>
            <FormatNumber value={amount} />
          </TDAmount>
          <TDAmount textAlign={'right'}>
            <FormatNumber value={amount} />
          </TDAmount>
        </TRDarkSingleLine>

        <TRDarkDoubleLines>
          <TDLabel>
            <T id={'manual_journal.details.total'} />
          </TDLabel>
          <TDAmount textAlign={'right'}>{formatted_amount}</TDAmount>
          <TDAmount textAlign={'right'}>{formatted_amount}</TDAmount>
        </TRDarkDoubleLines>
      </JournalTotalTable>
    </div>
  );
}

const JournalTotalTable = styled(Table)`
  font-weight: 600;
  width: auto;
  margin-left: auto;
`;

const TDLabel = styled(TD)`
  width: 220px;
`;

const TDAmount = styled(TD)`
  width: 155px;
`;
