import { Tab, Tabs } from '@blueprintjs/core';
import { MatchingBankTransaction } from './MatchingTransaction';
import styles from './CategorizeTransactionTabs.module.scss';
import { CategorizeTransactionContent } from '../CategorizeTransaction/drawers/CategorizeTransactionDrawer/CategorizeTransactionContent';

export function CategorizeTransactionTabs() {
  return (
    <Tabs large renderActiveTabPanelOnly className={styles.tabs}>
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
