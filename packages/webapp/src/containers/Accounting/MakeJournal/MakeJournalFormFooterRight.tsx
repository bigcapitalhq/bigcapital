// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import {
  useManualJournalSubtotalFormatted,
  useManualJournalTotalFormatted,
} from './utils';

export function MakeJournalFormFooterRight() {
  const formattedSubtotal = useManualJournalSubtotalFormatted();
  const formattedTotal = useManualJournalTotalFormatted();

  return (
    <MakeJouranlTotalLines>
      <TotalLine
        title={<T id={'make_journal.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'make_journal.label.total'} />}
        value={formattedTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </MakeJouranlTotalLines>
  );
}

const MakeJouranlTotalLines = styled(TotalLines)`
  --x-color-text: #555;
  --x-color-text: var(--color-light-gray4);

  width: 100%;
  color: var(--x-color-text);
`;
