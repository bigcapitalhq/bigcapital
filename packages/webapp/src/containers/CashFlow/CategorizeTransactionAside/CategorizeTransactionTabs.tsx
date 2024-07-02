// @ts-nocheck
import { Tab, Tabs } from '@blueprintjs/core';
import { MatchingBankTransaction } from './MatchingTransaction';
import { CategorizeTransactionContent } from '../CategorizeTransaction/drawers/CategorizeTransactionDrawer/CategorizeTransactionContent';
import { useCategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import styles from './CategorizeTransactionTabs.module.scss';

export function CategorizeTransactionTabs() {
  const { uncategorizedTransaction } = useCategorizeTransactionTabsBoot();
  const defaultSelectedTabId = uncategorizedTransaction?.is_recognized
    ? 'categorize'
    : 'matching';

  return (
    <Tabs
      large
      renderActiveTabPanelOnly
      defaultSelectedTabId={defaultSelectedTabId}
      className={styles.tabs}
    >
      <Tab
        id="categorize"
        title="Categorize Transaction"
        panel={<CategorizeTransactionContent />}
      />
      <Tab
        id="matching"
        title="Matching Transaction"
        panel={<MatchingBankTransaction />}
      />
    </Tabs>
  );
}
