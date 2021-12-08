import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import CreditNoteDetailActionsBar from './CreditNoteDetailActionsBar';
import CreditNoteDetailHeader from './CreditNoteDetailHeader';
import CreditNoteDetailTable from './CreditNoteDetailTable';
import CreditNoteDetailDrawerFooter from './CreditNoteDetailDrawerFooter';

import CreditNoteDetailCls from '../../../style/components/Drawers/CreditNoteDetails.module.scss';

export default function CreditNoteDetailPanel() {
  return (
    <div className={clsx(CreditNoteDetailCls.detail_panel)}>
      <CreditNoteDetailActionsBar />
      <Card>
        <CreditNoteDetailHeader />
        <CreditNoteDetailTable />
        <CreditNoteDetailDrawerFooter />
      </Card>
    </div>
  );
}
