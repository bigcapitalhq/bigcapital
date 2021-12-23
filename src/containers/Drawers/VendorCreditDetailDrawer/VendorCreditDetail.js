import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { Can, DrawerMainTabs } from 'components';
import VendorCreditDetailActionsBar from './VendorCreditDetailActionsBar';
import VendorCreditDetailPanel from './VendorCreditDetailPanel';
import RefundVendorCreditTransactionsTable from './RefundVendorCreditTransactions/RefundVendorCreditTransactionsTable';
import ReconcileVendorCreditTransactionsTable from './ReconcileVendorCreditTransactions/ReconcileVendorCreditTransactionsTable';
import { VendorCreditGLEntriesTable } from './JournalEntriesTransactions/JournalEntriesTransactionsTable';
import {
  VendorCreditAction,
  AbilitySubject,
} from '../../../common/abilityOption';

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
      {/* <Can I={VendorCreditAction.View} a={AbilitySubject.VendorCredit}> */}
        <Tab
          title={intl.get('vendor_credit.drawer.label_refund_transactions')}
          id={'refund_transactions'}
          panel={<RefundVendorCreditTransactionsTable />}
        />
        <Tab
          title={intl.get('vendor_credit.drawer.label_bills_reconciled')}
          id={'reconcile_transactions'}
          panel={<ReconcileVendorCreditTransactionsTable />}
        />
      {/* </Can> */}
    </DrawerMainTabs>
  );
}

const VendorCreditRoot = styled.div``;
