import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import {
  IManualJournal,
  IManualJournalEntry,
  IAccount,
  ILedgerEntry,
} from '@/interfaces';
import { Knex } from 'knex';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { LedgerRevert } from '@/services/Accounting/LedgerStorageRevert';

@Service()
export class ManualJournalGLEntries {
  @Inject()
  ledgerStorage: LedgerStorageService;

  @Inject()
  ledgerRevert: LedgerRevert;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Create manual journal GL entries.
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @param {Knex.Transaction} trx
   */
  public createManualJournalGLEntries = async (
    tenantId: number,
    manualJournalId: number,
    trx?: Knex.Transaction
  ) => {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Retrieves the given manual journal with associated entries.
    const manualJournal = await ManualJournal.query(trx)
      .findById(manualJournalId)
      .withGraphFetched('entries.account');

    // Retrieves the ledger entries of the given manual journal.
    const ledger = this.getManualJournalGLedger(manualJournal);

    // Commits the given ledger on the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Edits manual journal GL entries.
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @param {Knex.Transaction} trx
   */
  public editManualJournalGLEntries = async (
    tenantId: number,
    manualJournalId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the manual journal GL entries.
    await this.revertManualJournalGLEntries(tenantId, manualJournalId, trx);

    // Write the manual journal GL entries.
    await this.createManualJournalGLEntries(tenantId, manualJournalId, trx);
  };

  /**
   * Deletes the manual journal GL entries.
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @param {Knex.Transaction} trx
   */
  public revertManualJournalGLEntries = async (
    tenantId: number,
    manualJournalId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    return this.ledgerRevert.revertGLEntries(
      tenantId,
      manualJournalId,
      'Journal',
      trx
    );
  };

  /**
   *
   * @param   {IManualJournal} manualJournal
   * @returns {Ledger}
   */
  private getManualJournalGLedger = (manualJournal: IManualJournal) => {
    const entries = this.getManualJournalGLEntries(manualJournal);

    return new Ledger(entries);
  };

  /**
   *
   * @param   {IManualJournal} manualJournal
   * @returns {}
   */
  private getManualJournalCommonEntry = (manualJournal: IManualJournal) => {
    return {
      transactionNumber: manualJournal.journalNumber,
      referenceNumber: manualJournal.reference,
      createdAt: manualJournal.createdAt,
      date: manualJournal.date,
      currencyCode: manualJournal.currencyCode,
      exchangeRate: manualJournal.exchangeRate,

      transactionType: 'Journal',
      transactionId: manualJournal.id,

      userId: manualJournal.userId,
    };
  };

  /**
   *
   * @param   {IManualJournal} manualJournal -
   * @param   {IManualJournalEntry} entry -
   * @returns {ILedgerEntry}
   */
  private getManualJournalEntry = R.curry(
    (
      manualJournal: IManualJournal,
      entry: IManualJournalEntry
    ): ILedgerEntry => {
      const commonEntry = this.getManualJournalCommonEntry(manualJournal);

      return {
        ...commonEntry,
        debit: entry.debit,
        credit: entry.credit,
        accountId: entry.accountId,

        contactId: entry.contactId,
        note: entry.note,

        index: entry.index,
        accountNormal: entry.account.accountNormal,

        branchId: entry.branchId,
        projectId: entry.projectId,
      };
    }
  );

  /**
   *
   * @param   {IManualJournal} manualJournal
   * @returns {ILedgerEntry[]}
   */
  private getManualJournalGLEntries = (
    manualJournal: IManualJournal
  ): ILedgerEntry[] => {
    const transformEntry = this.getManualJournalEntry(manualJournal);

    return manualJournal.entries.map(transformEntry).flat();
  };
}
