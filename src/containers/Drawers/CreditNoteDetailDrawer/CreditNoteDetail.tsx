import React from 'react';
import { Tab } from '@blueprintjs/core';
import styled from 'styled-components';
import intl from 'react-intl-universal';

import { useAbilityContext } from '@/hooks/utils';
import { DrawerMainTabs } from '@/components';
import CreditNoteDetailActionsBar from './CreditNoteDetailActionsBar';
import CreditNoteDetailPanel from './CreditNoteDetailPanel';
import RefundCreditNoteTransactionsTable from './RefundCreditNoteTransactions/RefundCreditNoteTransactionsTable';
import ReconcileCreditNoteTransactionsTable from './ReconcileCreditNoteTransactions/ReconcileCreditNoteTransactionsTable';
import { CreditNoteGLEntriesTable } from './JournalEntriesTransactions/JournalEntriesTransactionsTable';
import {
  CreditNoteAction,
  AbilitySubject,
} from '../../../common/abilityOption';

/**
 * Credit Note view detail.
 * @returns {React.JSX}
 */
export default function CreditNoteDetail() {
  return (
    <CreditNoteRoot>
      <CreditNoteDetailActionsBar />
      <CreditNoteDetailsTabs />
    </CreditNoteRoot>
  );
}

/**
 * Credit note details tabs.
 * @returns {React.JSX}
 */
function CreditNoteDetailsTabs() {
  const ability = useAbilityContext();

  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<CreditNoteDetailPanel />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<CreditNoteGLEntriesTable />}
      />

      {ability.can(CreditNoteAction.View, AbilitySubject.CreditNote) && (
        <Tab
          title={intl.get('credit_note.drawer.label_refund_transactions')}
          id={'refund_transactions'}
          panel={<RefundCreditNoteTransactionsTable />}
        />
      )}
      {ability.can(CreditNoteAction.View, AbilitySubject.CreditNote) && (
        <Tab
          title={intl.get('credit_note.drawer.label_invoices_reconciled')}
          id={'reconcile_transactions'}
          panel={<ReconcileCreditNoteTransactionsTable />}
        />
      )}
    </DrawerMainTabs>
  );
}

const CreditNoteRoot = styled.div``;
