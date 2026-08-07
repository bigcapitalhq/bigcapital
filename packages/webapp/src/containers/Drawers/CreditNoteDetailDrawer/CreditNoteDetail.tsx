import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { CreditNoteDetailActionsBar } from './CreditNoteDetailActionsBar';
import { CreditNoteDetailPanel } from './CreditNoteDetailPanel';
import { CreditNoteGLEntriesTable } from './JournalEntriesTransactions/JournalEntriesTransactionsTable';
import { ReconcileCreditNoteTransactionsTable } from './ReconcileCreditNoteTransactions/ReconcileCreditNoteTransactionsTable';
import { RefundCreditNoteTransactionsTable } from './RefundCreditNoteTransactions/RefundCreditNoteTransactionsTable';
import { DrawerMainTabs } from '@/components';
import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import { useAbilityContext } from '@/hooks/utils';

/**
 * Credit Note view detail.
 */
export function CreditNoteDetail() {
  return (
    <CreditNoteRoot>
      <CreditNoteDetailActionsBar />
      <CreditNoteDetailsTabs />
    </CreditNoteRoot>
  );
}

/**
 * Credit note details tabs.
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
