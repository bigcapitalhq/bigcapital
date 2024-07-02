import AccountTransactionsUncategorizedTable from '../AccountTransactionsUncategorizedTable';
import { AccountUncategorizedTransactionsBoot } from '../AllTransactionsUncategorizedBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';

export function AccountUncategorizedTransactionsAll() {
  return (
    <AccountUncategorizedTransactionsBoot>
      <AccountTransactionsCard>
        <AccountTransactionsUncategorizedTable />
      </AccountTransactionsCard>
    </AccountUncategorizedTransactionsBoot>
  );
}
