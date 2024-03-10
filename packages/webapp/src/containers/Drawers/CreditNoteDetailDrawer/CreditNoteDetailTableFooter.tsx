// @ts-nocheck
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

/**
 * Credit note details panel footer.
 */
export default function CreditNoteDetailTableFooter() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <CreditNoteDetailsFooterRoot>
      <CreditNoteTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'credit_note.drawer.label_subtotal'} />}
          value={creditNote.formatted_subtotal}
        />
        <TotalLine
          title={<T id={'credit_note.drawer.label_total'} />}
          value={creditNote.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </CreditNoteTotalLines>
    </CreditNoteDetailsFooterRoot>
  );
}

export const CreditNoteDetailsFooterRoot = styled.div``;

export const CreditNoteTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
