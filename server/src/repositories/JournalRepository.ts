import { IBalanceSheetQuery } from 'interfaces';
import TenantRepository from 'repositories/TenantRepository';


export default class JournalRepository extends TenantRepository {
  
  balanceSheet(query: IBalanceSheetQuery) {
    
    // Accounts dependency graph.
    const accountsGraph = Account.toDependencyGraph(balanceSheetAccounts);

    // Load all entries that associated to the given accounts.
    const journalEntriesCollected = Account.collectJournalEntries(balanceSheetAccounts);

    const journalEntries = new JournalPoster(accountsGraph);
    journalEntries.loadEntries(journalEntriesCollected);
  }
}