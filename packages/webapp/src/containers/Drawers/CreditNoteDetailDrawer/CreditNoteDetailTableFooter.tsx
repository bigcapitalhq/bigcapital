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
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {creditNote.discount_amount > 0 && (
          <TotalLine
            title={
              creditNote.discount_percentage_formatted
                ? `Discount [${creditNote.discount_percentage_formatted}]`
                : 'Discount'
            }
            value={creditNote.discount_amount_formatted}
          />
        )}
        {creditNote.adjustment_formatted && (
          <TotalLine
            title={'Adjustment'}
            value={creditNote.adjustment_formatted}
          />
        )}
        <TotalLine
          title={<T id={'credit_note.drawer.label_total'} />}
          value={creditNote.total_formatted}
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
