import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine, If } from 'components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import { FormatNumber } from '../../../components';

import CreditNoteDetailCls from '../../../style/components/Drawers/CreditNoteDetails.module.scss';

/**
 * Credit note details panel footer.
 */
export default function CreditNoteDetailDrawerFooter() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <div className={clsx(CreditNoteDetailCls.detail_panel_footer)}>
      <TotalLines className={clsx(CreditNoteDetailCls.total_lines)}>
        <TotalLine
          title={<T id={'credit_note.drawer.label_subtotal'} />}
          value={<FormatNumber value={creditNote.amount} />}
          className={CreditNoteDetailCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'credit_note.drawer.label_total'} />}
          value={creditNote.amount}
          className={CreditNoteDetailCls.total_line_total}
        />
      </TotalLines>
    </div>
  );
}
