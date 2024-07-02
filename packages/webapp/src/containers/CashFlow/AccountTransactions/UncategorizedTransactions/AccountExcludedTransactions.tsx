import { ExcludedTransactionsTable } from "../ExcludedTransactions/ExcludedTransactionsTable";
import { ExcludedBankTransactionsTableBoot } from "../ExcludedTransactions/ExcludedTransactionsTableBoot";
import { AccountTransactionsCard } from "./AccountTransactionsCard";

export function AccountExcludedTransactions() {
  return (
    <ExcludedBankTransactionsTableBoot>
      <AccountTransactionsCard>
        <ExcludedTransactionsTable />
      </AccountTransactionsCard>
    </ExcludedBankTransactionsTableBoot>
  );
}
