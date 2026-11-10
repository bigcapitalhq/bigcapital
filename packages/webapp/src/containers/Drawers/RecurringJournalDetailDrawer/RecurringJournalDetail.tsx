import { Tab, TabId } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { RecurringJournalDetailActionsBar } from './RecurringJournalDetailActionsBar';
import { RecurringJournalDetailTab } from './RecurringJournalDetailTab';
import { RecurringJournalGeneratedJournalsTab } from './RecurringJournalGeneratedJournalsTab';
import type { RecurringJournalDetailTabId } from './types';
import { DrawerMainTabs } from '@/components';

interface RecurringJournalDetailProps {
  defaultTab?: RecurringJournalDetailTabId;
  isOpen?: boolean;
}

/**
 * Recurring journal details tabs.
 */
function RecurringJournalDetailsTabs({
  defaultTab = 'details',
  isOpen,
}: RecurringJournalDetailProps) {
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
        panel={<RecurringJournalDetailTab />}
      />
      <Tab
        title={intl.get('recurring_journal.generated_journals')}
        id={'journals'}
        panel={<RecurringJournalGeneratedJournalsTab />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Recurring journal view detail.
 */
export function RecurringJournalDetail({
  defaultTab,
  isOpen,
}: RecurringJournalDetailProps) {
  return (
    <RecurringJournalDetailsRoot>
      <RecurringJournalDetailActionsBar />
      <RecurringJournalDetailsTabs defaultTab={defaultTab} isOpen={isOpen} />
    </RecurringJournalDetailsRoot>
  );
}

const RecurringJournalDetailsRoot = styled.div``;
