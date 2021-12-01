import React from 'react';
import clsx from 'classnames';

import { DataTable } from 'components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

import { useCreditNoteReadOnlyEntriesColumns } from './utils';

import CreditNoteDetailCls from '../../../style/components/Drawers/CreditNoteDetails.module.scss';

/**
 * Credit note detail table.
 */
export default function CreditNoteDetailTable() {
  const {
    creditNote: { entries },
  } = useCreditNoteDetailDrawerContext();

  // Credit note entries table columns.
  const columns = useCreditNoteReadOnlyEntriesColumns();

  return (
    <div className={clsx(CreditNoteDetailCls.detail_panel_table)}>
      <DataTable
        columns={columns}
        data={entries}
        className={'table-constrant'}
      />
    </div>
  );
}
