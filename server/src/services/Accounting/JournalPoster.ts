import { omit } from 'lodash';
import { Container } from 'typedi';
import JournalEntry from '@/services/Accounting/JournalEntry';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IJournalEntry,
  IJournalPoster,
  IAccountChange,
  IAccountsChange,
  TEntryType,
} from '@/interfaces';

export default class JournalPoster implements IJournalPoster {
  tenantId: number;
  tenancy: TenancyService;
  logger: any;
  models: any;
  repositories: any;

  deletedEntriesIds: number[] = [];
  entries: IJournalEntry[] = [];
  balancesChange: IAccountsChange = {};
  accountsDepGraph: IAccountsChange = {};

  /**
   * Journal poster constructor.
   * @param {number} tenantId - 
   */
  constructor(
    tenantId: number,
  ) {
    this.initTenancy();

    this.tenantId = tenantId;
    this.models = this.tenancy.models(tenantId);
    this.repositories = this.tenancy.repositories(tenantId);
  }

  /**
   * Initial tenancy.
   * @private
   */
  private initTenancy() {
    try {
      this.tenancy = Container.get(TenancyService);
      this.logger = Container.get('logger');
    } catch (exception) {
      throw new Error('Should execute this class inside tenancy area.');
    }
  }

  /**
   * Async initialize acccounts dependency graph.
   * @private 
   * @returns {Promise<void>}
   */
  private async initializeAccountsDepGraph(): Promise<void> {
    const { accountRepository } = this.repositories;
    const accountsDepGraph = await accountRepository.getDependencyGraph();
    this.accountsDepGraph = accountsDepGraph;
  }

  /**
   * Writes the credit entry for the given account.
   * @param {IJournalEntry} entry -
   */
  public credit(entryModel: IJournalEntry): void {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry);
  }

  /**
   * Writes the debit entry for the given account.
   * @param {JournalEntry} entry -
   */
  public debit(entryModel: IJournalEntry): void {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry);
  }

  /**
   * Sets account balance change.
   * @param {JournalEntry} entry
   * @param {String} type
   */
  private setAccountBalanceChange(entry: IJournalEntry): void {
    const accountChange: IAccountChange = {
      debit: entry.debit,
      credit: entry.credit,
    };
    this._setAccountBalanceChange(entry.account, accountChange);
  }

  /**
   * Sets account balance change.
   * @private
   * @param {number} accountId - 
   * @param {IAccountChange} accountChange
   */
  private _setAccountBalanceChange(
    accountId: number,
    accountChange: IAccountChange
  ) {
    this.balancesChange = this.accountBalanceChangeReducer(
      this.balancesChange, accountId, accountChange,
    );
  }

  /**
   * Accounts balance change reducer.
   * @param {IAccountsChange} balancesChange 
   * @param {number} accountId 
   * @param {IAccountChange} accountChange
   * @return {IAccountChange} 
   */
  private accountBalanceChangeReducer(
    balancesChange: IAccountsChange,
    accountId: number,
    accountChange: IAccountChange,
  ) {
    const change = { ...balancesChange };

    if (!change[accountId]) {
      change[accountId] = { credit: 0, debit: 0 };
    }
    if (accountChange.credit) {
      change[accountId].credit += accountChange.credit;
    }
    if (accountChange.debit) {
      change[accountId].debit += accountChange.debit;
    }
    return change;
  }

  /**
   * Converts balance changes to array.
   * @private
   * @param {IAccountsChange} accountsChange - 
   * @return {Promise<{ account: number, change: number }>}
   */
  private async convertBalanceChangesToArr(
    accountsChange: IAccountsChange
  ) : Promise<{ account: number, change: number }[]>{
    const { accountTypeRepository } = this.repositories;
    const mappedList: { account: number, change: number }[] = [];
    const accountsIds: number[] = Object.keys(accountsChange).map(id => parseInt(id, 10));

    await Promise.all(
      accountsIds.map(async (account: number) => {
        const accountChange = accountsChange[account];
        const accountNode = this.accountsDepGraph.getNodeData(account);
        const accountTypeMeta = await accountTypeRepository.getTypeMeta(accountNode.accountTypeId);
        const { normal }: { normal: TEntryType } = accountTypeMeta;
        let change = 0;

        if (accountChange.credit) {
          change = (normal === 'credit') ? accountChange.credit : -1 * accountChange.credit;
        }
        if (accountChange.debit) {
          change = (normal === 'debit') ? accountChange.debit : -1 * accountChange.debit;
        }
        mappedList.push({ account, change });
      }),
    );
    return mappedList;
  }

  /**
   * Saves the balance change of journal entries.
   * @returns {Promise<void>}
   */
  public async saveBalance() {
    await this.initializeAccountsDepGraph();

    const { Account } = this.models;
    const accountsChange = this.balanceChangeWithDepends(this.balancesChange);
    const balancesList = await this.convertBalanceChangesToArr(accountsChange);
    const balancesAccounts = balancesList.map(b => b.account);

    // Ensure the accounts has atleast zero in amount.
    await Account.query().where('amount', null).whereIn('id', balancesAccounts)
      .patch({ amount: 0 });

    const balanceUpdateOpers: Promise<void>[] = [];

    balancesList.forEach((balance: { account: number, change: number }) => {
      const method: string = (balance.change < 0) ? 'decrement' : 'increment';

      this.logger.info('[journal_poster] increment/decrement account balance.', {
        balance, tenantId: this.tenantId,
      })
      const query = Account.query()
        [method]('amount', Math.abs(balance.change))
        .where('id', balance.account);

      balanceUpdateOpers.push(query);
    });

    await Promise.all(balanceUpdateOpers);
    this.resetAccountsBalanceChange();
  }

  /**
   * Changes all accounts that dependencies of changed accounts.
   * @param {IAccountsChange} accountsChange 
   * @returns {IAccountsChange}
   */
  private balanceChangeWithDepends(accountsChange: IAccountsChange): IAccountsChange {
    const accountsIds = Object.keys(accountsChange);
    let changes: IAccountsChange = {};

    accountsIds.forEach((accountId) => {
      const accountChange = accountsChange[accountId];
      const depAccountsIds = this.accountsDepGraph.dependenciesOf(accountId);
      
      [accountId, ...depAccountsIds].forEach((account) => {
        changes = this.accountBalanceChangeReducer(changes, account, accountChange);
      });
    });
    return changes;
  }

  /**
   * Resets accounts balance change.
   * @private
   */
  private resetAccountsBalanceChange() {
    this.balancesChange = {};
  }

  /**
   * Saves the stacked journal entries to the storage.
   * @returns {Promise<void>}
   */
  public async saveEntries() {
    const { AccountTransaction } = this.models;
    const saveOperations: Promise<void>[] = [];

    this.entries.forEach((entry) => {
      const oper = AccountTransaction.query()
        .insert({
          accountId: entry.account,
          ...omit(entry, ['account']),
        });
      saveOperations.push(oper);
    });
    await Promise.all(saveOperations);
  }

  /**
   * Reverses the stacked journal entries.
   */
  public reverseEntries() {
    const reverseEntries: IJournalEntry[] = [];

    this.entries.forEach((entry) => {
      const reverseEntry = { ...entry };

      if (entry.credit) {
        reverseEntry.debit = entry.credit;
      }
      if (entry.debit) {
        reverseEntry.credit = entry.debit;
      }
      reverseEntries.push(reverseEntry);
    });
    this.entries = reverseEntries;
  }

  /**
   * Removes all stored entries or by the given in ids.
   * @param {Array} ids -
   */
  removeEntries(ids: number[] = []) {
    const targetIds = ids.length <= 0 ? this.entries.map((e) => e.id) : ids;
    const removeEntries = this.entries.filter(
      (e) => targetIds.indexOf(e.id) !== -1
    );
    this.entries = this.entries.filter((e) => targetIds.indexOf(e.id) === -1);

    removeEntries.forEach((entry) => {
      entry.credit = -1 * entry.credit;
      entry.debit = -1 * entry.debit;

      this.setAccountBalanceChange(entry, entry.accountNormal);
    });
    this.deletedEntriesIds.push(...removeEntries.map((entry) => entry.id));
  }

  /**
   * Delete all the stacked entries.
   * @return {Promise<void>}
   */
  public async deleteEntries() {
    const { AccountTransaction } = this.models;

    if (this.deletedEntriesIds.length > 0) {
      await AccountTransaction.query()
        .whereIn('id', this.deletedEntriesIds)
        .delete();
    }
  }

  /**
   * Load fetched accounts journal entries.
   * @param {IJournalEntry[]} entries -
   */
  loadEntries(entries: IJournalEntry[]): void {
    entries.forEach((entry: IJournalEntry) => {
      this.entries.push({
        ...entry,
        account: entry.account ? entry.account.id : entry.accountId,
      });
    });
  }

  /**
   * Calculates the entries balance change.
   * @public
   */
  public calculateEntriesBalanceChange() {
    this.entries.forEach((entry) => {
      if (entry.credit) {
        this.setAccountBalanceChange(entry, 'credit');
      }
      if (entry.debit) {
        this.setAccountBalanceChange(entry, 'debit');
      }
    });
  }
}
