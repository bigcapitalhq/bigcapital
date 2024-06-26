import { Aside } from '@/components/Aside/Aside';
import { CategorizeTransactionTabs } from './CategorizeTransactionTabs';

export function CategorizeTransactionAside() {
  return (
    <Aside title={'Categorize Bank Transaction'}>
      <CategorizeTransactionTabs />
    </Aside>
  );
}
