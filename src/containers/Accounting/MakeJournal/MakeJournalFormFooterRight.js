import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';
import { useJournalTotals } from './utils';

export function MakeJournalFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = useJournalTotals();

  return (
    <MakeJouranlTotalLines>
      <TotalLine
        title={<T id={'manual_journal.details.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'manual_journal.details.total'} />}
        value={formattedTotal}
        // borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
    </MakeJouranlTotalLines>
  );
}

const MakeJouranlTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
