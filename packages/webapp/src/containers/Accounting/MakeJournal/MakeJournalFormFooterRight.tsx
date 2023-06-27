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
import { useJournalTotals } from './utils';

export function MakeJournalFormFooterRight() {
  const { formattedSubtotal, formattedTotal } = useJournalTotals();

  return (
    <MakeJournalTotalLines>
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
    </MakeJournalTotalLines>
  );
}

const MakeJournalTotalLines =styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
