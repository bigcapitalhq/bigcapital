import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useJournalTotals } from './utils';

export function MakeJournalFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = useJournalTotals();

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

const MakeJouranlTotalLines =styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
