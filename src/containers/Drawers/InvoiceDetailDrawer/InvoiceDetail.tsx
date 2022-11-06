// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Tab } from '@blueprintjs/core';

import { useAbilityContext } from '@/hooks/utils';
import { DrawerMainTabs } from '@/components';
import { PaymentReceiveAction, AbilitySubject } from '@/constants/abilityOption';
import InvoiceDetailActionsBar from './InvoiceDetailActionsBar';
import InvoiceGLEntriesTable from './InvoiceGLEntriesTable';
import InvoicePaymentTransactionsTable from './InvoicePaymentTransactions/InvoicePaymentTransactionsTable';
import InvoiceDetailTab from './InvoiceDetailTab';

/**
 * Invoice details tabs.
 * @returns {React.JSX}
 */
function InvoiceDetailsTabs() {
  const ability = useAbilityContext();

  return (
    <DrawerMainTabs
      renderActiveTabPanelOnly={true}
      defaultSelectedTabId="details"
    >
      <Tab
        title={intl.get('overview')}
        id={'details'}
        panel={<InvoiceDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<InvoiceGLEntriesTable />}
      />
      {ability.can(
        PaymentReceiveAction.View,
        AbilitySubject.PaymentReceive,
      ) && (
        <Tab
          title={intl.get('payment_transactions')}
          id={'payment_transactions'}
          panel={<InvoicePaymentTransactionsTable />}
        />
      )}
    </DrawerMainTabs>
  );
}

/**
 * Invoice view detail.
 * @returns {React.JSX}
 */
export default function InvoiceDetail() {
  return (
    <InvoiceDetailsRoot>
      <InvoiceDetailActionsBar />
      <InvoiceDetailsTabs />
    </InvoiceDetailsRoot>
  );
}

export const InvoiceDetailsRoot = styled.div``;
