import { Tab, Tabs } from '@blueprintjs/core';
import {
  CategorizeBankTransactionContent,
  MatchingBankTransaction,
} from './MatchingTransaction';
import styles from './CategorizeTransactionTabs.module.scss';

export function CategorizeTransactionTabs() {
  return (
    <Tabs large className={styles.tabs}>
      <Tab
        id="categorize"
        title="Categorize Transaction"
        panel={<CategorizeBankTransactionContent />}
      />
      <Tab
        id="matching"
        title="Matching Transaction"
        panel={<MatchingBankTransaction />}
      />
    </Tabs>
  );
}
