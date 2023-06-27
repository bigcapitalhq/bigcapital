import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { ILedger } from '@/interfaces';
import { LedgerContactsBalanceStorage } from './LedgerContactStorage';
import { LedgerAccountsStorage } from './LedgetAccountStorage';
import { LedgerEntriesStorage } from './LedgerEntriesStorage';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Ledger from './Ledger';
@Service()
export default class LedgerStorageService {
  @Inject()
  private ledgerEntriesService: LedgerEntriesStorage;

  @Inject()
  private ledgerContactsBalance: LedgerContactsBalanceStorage;

  @Inject()
  private ledgerAccountsBalance: LedgerAccountsStorage;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Commit the ledger to the storage layer as one unit-of-work.
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @returns {Promise<void>}
   */
  public commit = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const tasks = [
      // Saves the ledger entries.
      this.ledgerEntriesService.saveEntries(tenantId, ledger, trx),

      // Mutates the associated accounts balances.
      this.ledgerAccountsBalance.saveAccountsBalance(tenantId, ledger, trx),

      // Mutates the associated contacts balances.
      this.ledgerContactsBalance.saveContactsBalance(tenantId, ledger, trx),
    ];
    await Promise.all(tasks);
  };

  /**
   * Deletes the given ledger and revert balances.
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public delete = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ) => {
    const tasks = [
      // Deletes the ledger entries.
      this.ledgerEntriesService.deleteEntries(tenantId, ledger, trx),

      // Mutates the associated accounts balances.
      this.ledgerAccountsBalance.saveAccountsBalance(tenantId, ledger, trx),

      // Mutates the associated contacts balances.
      this.ledgerContactsBalance.saveContactsBalance(tenantId, ledger, trx),
    ];
    await Promise.all(tasks);
  };

  /**
   * @param tenantId
   * @param referenceId
   * @param referenceType
   * @param trx
   */
  public deleteByReference = async (
    tenantId: number,
    referenceId: number | number[],
    referenceType: string | string[],
    trx?: Knex.Transaction
  ) => {
    const { transactionsRepository } = this.tenancy.repositories(tenantId);

    // Retrieves the transactions of the given reference.
    const transactions =
      await transactionsRepository.getTransactionsByReference(
        referenceId,
        referenceType
      );
    // Creates a new ledger from transaction and reverse the entries.
    const reversedLedger = Ledger.fromTransactions(transactions).reverse();

    // Deletes and reverts the balances.
    await this.delete(tenantId, reversedLedger, trx);
  };
}
