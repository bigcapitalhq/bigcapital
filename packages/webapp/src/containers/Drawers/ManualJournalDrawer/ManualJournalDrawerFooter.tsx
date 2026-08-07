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
export function ManualJournalDrawerFooter() {
  const { manualJournal } = useManualJournalDrawerContext();

  if (!manualJournal) return null;

  const { amount, formattedAmount } = manualJournal;

  return (
    <div className="journal-drawer__content-footer">
      <JournalTotalTable>
        <TRDarkSingleLine>
          <TDLabel>
            <T id={'manual_journal.details.subtotal'} />
          </TDLabel>
          <TDAmount textAlign={'right'}>
            <FormatNumber value={amount} noZero={false} />
          </TDAmount>
          <TDAmount textAlign={'right'}>
            <FormatNumber value={amount} noZero={false} />
          </TDAmount>
        </TRDarkSingleLine>

        <TRDarkDoubleLines>
          <TDLabel>
            <T id={'manual_journal.details.total'} />
          </TDLabel>
          <TDAmount textAlign={'right'}>{formattedAmount}</TDAmount>
          <TDAmount textAlign={'right'}>{formattedAmount}</TDAmount>
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

const TDAmount = styled(TD)<{ textAlign?: string }>`
  width: 155px;
`;
