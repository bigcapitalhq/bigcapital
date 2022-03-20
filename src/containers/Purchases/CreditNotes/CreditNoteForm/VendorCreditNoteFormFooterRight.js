import React from 'react';
import styled from 'styled-components';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from 'components';

export function VendorCreditNoteFormFooterRight() {
  return (
    <VendorCreditNoteTotalLines
      labelColWidth={'180px'}
      amountColWidth={'180px'}
    >
      <TotalLine
        title={<T id={'credit_note.drawer.label_subtotal'} />}
        value={'$5000.00'}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'credit_note.drawer.label_total'} />}
        value={'$5000.00'}
        // borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
    </VendorCreditNoteTotalLines>
  );
}

const VendorCreditNoteTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
