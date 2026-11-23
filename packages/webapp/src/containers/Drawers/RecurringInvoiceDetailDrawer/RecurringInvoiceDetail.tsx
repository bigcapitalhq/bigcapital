import { Tab, TabId } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { RecurringInvoiceDetailActionsBar } from './RecurringInvoiceDetailActionsBar';
import { RecurringInvoiceDetailTab } from './RecurringInvoiceDetailTab';
import { RecurringInvoiceGeneratedInvoicesTab } from './RecurringInvoiceGeneratedInvoicesTab';
import type { RecurringInvoiceDetailTabId } from './types';
import { DrawerMainTabs } from '@/components';

interface RecurringInvoiceDetailProps {
  defaultTab?: RecurringInvoiceDetailTabId;
  isOpen?: boolean;
}

/**
 * Recurring invoice details tabs.
 */
function RecurringInvoiceDetailsTabs({
  defaultTab = 'details',
  isOpen,
}: RecurringInvoiceDetailProps) {
  const [selectedTabId, setSelectedTabId] = React.useState<TabId>(defaultTab);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedTabId(defaultTab);
    }
  }, [defaultTab, isOpen]);

  return (
    <DrawerMainTabs
      renderActiveTabPanelOnly={true}
      selectedTabId={selectedTabId}
      onChange={(tabId) => setSelectedTabId(tabId)}
    >
      <Tab
        title={intl.get('overview')}
        id={'details'}
        panel={<RecurringInvoiceDetailTab />}
      />
      <Tab
        title={intl.get('recurring_invoice.generated_invoices')}
        id={'invoices'}
        panel={<RecurringInvoiceGeneratedInvoicesTab />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Recurring invoice view detail.
 */
export function RecurringInvoiceDetail({
  defaultTab,
  isOpen,
}: RecurringInvoiceDetailProps) {
  return (
    <RecurringInvoiceDetailsRoot>
      <RecurringInvoiceDetailActionsBar />
      <RecurringInvoiceDetailsTabs defaultTab={defaultTab} isOpen={isOpen} />
    </RecurringInvoiceDetailsRoot>
  );
}

const RecurringInvoiceDetailsRoot = styled.div``;
