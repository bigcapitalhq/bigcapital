import styled from 'styled-components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

/**
 * Credit note details panel footer.
 */
export function CreditNoteDetailTableFooter() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <CreditNoteDetailsFooterRoot>
      <CreditNoteTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'credit_note.drawer.label_subtotal'} />}
          value={creditNote?.formattedSubtotal}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {(creditNote?.discountAmount ?? 0) > 0 && (
          <TotalLine
            title={
              creditNote?.discountPercentageFormatted
                ? `Discount [${creditNote.discountPercentageFormatted}]`
                : 'Discount'
            }
            value={creditNote?.discountAmountFormatted}
          />
        )}
        {creditNote?.adjustmentFormatted && (
          <TotalLine
            title={'Adjustment'}
            value={creditNote.adjustmentFormatted}
          />
        )}
        <TotalLine
          title={<T id={'credit_note.drawer.label_total'} />}
          value={creditNote?.totalFormatted}
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
