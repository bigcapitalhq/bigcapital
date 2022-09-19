// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { useAbilityContext } from '@/hooks/utils';
import { DrawerMainTabs } from '@/components';
import VendorCreditDetailActionsBar from './VendorCreditDetailActionsBar';
import VendorCreditDetailPanel from './VendorCreditDetailPanel';
import RefundVendorCreditTransactionsTable from './RefundVendorCreditTransactions/RefundVendorCreditTransactionsTable';
import ReconcileVendorCreditTransactionsTable from './ReconcileVendorCreditTransactions/ReconcileVendorCreditTransactionsTable';
import { VendorCreditGLEntriesTable } from './JournalEntriesTransactions/JournalEntriesTransactionsTable';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Vendor credit view detail.
 *
 */
export default function VendorCreditDetail() {
  return (
    <VendorCreditRoot>
      <VendorCreditDetailActionsBar />
      <VendorCreditDetailsTabs />
    </VendorCreditRoot>
  );
}

/**
 * Vendor Credit details tabs.
 * @returns {React.JSX}
 */
function VendorCreditDetailsTabs() {
  const ability = useAbilityContext();

  return (
    <DrawerMainTabs renderActiveTabPanelOnly={true}>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<VendorCreditDetailPanel />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<VendorCreditGLEntriesTable />}
      />
      {ability.can(VendorCreditAction.View, AbilitySubject.VendorCredit) && (
        <Tab
          title={intl.get('vendor_credit.drawer.label_refund_transactions')}
          id={'refund_transactions'}
          panel={<RefundVendorCreditTransactionsTable />}
        />
      )}
      {ability.can(VendorCreditAction.View, AbilitySubject.VendorCredit) && (
        <Tab
          title={intl.get('vendor_credit.drawer.label_bills_reconciled')}
          id={'reconcile_transactions'}
          panel={<ReconcileVendorCreditTransactionsTable />}
        />
      )}
    </DrawerMainTabs>
  );
}

const VendorCreditRoot = styled.div``;
