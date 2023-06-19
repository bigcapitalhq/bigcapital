import * as R from 'ramda';
import { Knex } from 'knex';
import {
  AccountNormal,
  IBill,
  IBillLandedCost,
  IBillLandedCostEntry,
  ILandedCostTransactionEntry,
  ILedger,
  ILedgerEntry,
} from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import { Service, Inject } from 'typedi';
import LedgerRepository from '@/services/Ledger/LedgerRepository';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import BaseLandedCostService from './BaseLandedCost';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export default class LandedCostGLEntries extends BaseLandedCostService {
  @Inject()
  private journalService: JournalPosterService;

  @Inject()
  private ledgerRepository: LedgerRepository;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the landed cost GL common entry.
   * @param   {IBill} bill
   * @param   {IBillLandedCost} allocatedLandedCost
   * @returns
   */
  private getLandedCostGLCommonEntry = (
    bill: IBill,
    allocatedLandedCost: IBillLandedCost
  ) => {
    return {
      date: bill.billDate,
      currencyCode: allocatedLandedCost.currencyCode,
      exchangeRate: allocatedLandedCost.exchangeRate,

      transactionType: 'LandedCost',
      transactionId: allocatedLandedCost.id,
      transactionNumber: bill.billNumber,

      referenceNumber: bill.referenceNo,

      credit: 0,
      debit: 0,
    };
  };

  /**
   * Retrieves the landed cost GL inventory entry.
   * @param   {IBill} bill
   * @param   {IBillLandedCost} allocatedLandedCost
   * @param   {IBillLandedCostEntry} allocatedEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLInventoryEntry = (
    bill: IBill,
    allocatedLandedCost: IBillLandedCost,
    allocatedEntry: IBillLandedCostEntry
  ): ILedgerEntry => {
    const commonEntry = this.getLandedCostGLCommonEntry(
      bill,
      allocatedLandedCost
    );
    return {
      ...commonEntry,
      debit: allocatedLandedCost.localAmount,
      accountId: allocatedEntry.itemEntry.item.inventoryAccountId,
      index: 1,
      accountNormal: AccountNormal.DEBIT,
    };
  };

  /**
   * Retrieves the landed cost GL cost entry.
   * @param   {IBill} bill
   * @param   {IBillLandedCost} allocatedLandedCost
   * @param   {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLCostEntry = (
    bill: IBill,
    allocatedLandedCost: IBillLandedCost,
    fromTransactionEntry: ILandedCostTransactionEntry
  ): ILedgerEntry => {
    const commonEntry = this.getLandedCostGLCommonEntry(
      bill,
      allocatedLandedCost
    );
    return {
      ...commonEntry,
      credit: allocatedLandedCost.localAmount,
      accountId: fromTransactionEntry.costAccountId,
      index: 2,
      accountNormal: AccountNormal.CREDIT,
    };
  };

  /**
   * Retrieve allocated landed cost entry GL entries.
   * @param   {IBill} bill
   * @param   {IBillLandedCost} allocatedLandedCost
   * @param   {ILandedCostTransactionEntry} fromTransactionEntry
   * @param   {IBillLandedCostEntry} allocatedEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLAllocateEntry = R.curry(
    (
      bill: IBill,
      allocatedLandedCost: IBillLandedCost,
      fromTransactionEntry: ILandedCostTransactionEntry,
      allocatedEntry: IBillLandedCostEntry
    ): ILedgerEntry[] => {
      const inventoryEntry = this.getLandedCostGLInventoryEntry(
        bill,
        allocatedLandedCost,
        allocatedEntry
      );
      const costEntry = this.getLandedCostGLCostEntry(
        bill,
        allocatedLandedCost,
        fromTransactionEntry
      );
      return [inventoryEntry, costEntry];
    }
  );

  /**
   * Compose the landed cost GL entries.
   * @param   {IBillLandedCost} allocatedLandedCost
   * @param   {IBill} bill
   * @param   {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedgerEntry[]}
   */
  public getLandedCostGLEntries = (
    allocatedLandedCost: IBillLandedCost,
    bill: IBill,
    fromTransactionEntry: ILandedCostTransactionEntry
  ): ILedgerEntry[] => {
    const getEntry = this.getLandedCostGLAllocateEntry(
      bill,
      allocatedLandedCost,
      fromTransactionEntry
    );
    return allocatedLandedCost.allocateEntries.map(getEntry).flat();
  };

  /**
   * Retrieves the landed cost GL ledger.
   * @param   {IBillLandedCost} allocatedLandedCost
   * @param   {IBill} bill
   * @param   {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedger}
   */
  public getLandedCostLedger = (
    allocatedLandedCost: IBillLandedCost,
    bill: IBill,
    fromTransactionEntry: ILandedCostTransactionEntry
  ): ILedger => {
    const entries = this.getLandedCostGLEntries(
      allocatedLandedCost,
      bill,
      fromTransactionEntry
    );
    return new Ledger(entries);
  };

  /**
   * Writes landed cost GL entries to the storage layer.
   * @param {number} tenantId -
   */
  public writeLandedCostGLEntries = async (
    tenantId: number,
    allocatedLandedCost: IBillLandedCost,
    bill: IBill,
    fromTransactionEntry: ILandedCostTransactionEntry,
    trx?: Knex.Transaction
  ) => {
    const ledgerEntries = this.getLandedCostGLEntries(
      allocatedLandedCost,
      bill,
      fromTransactionEntry
    );
    await this.ledgerRepository.saveLedgerEntries(tenantId, ledgerEntries, trx);
  };

  /**
   * Generates and writes GL entries of the given landed cost.
   * @param {number} tenantId
   * @param {number} billLandedCostId
   * @param {Knex.Transaction} trx
   */
  public createLandedCostGLEntries = async (
    tenantId: number,
    billLandedCostId: number,
    trx?: Knex.Transaction
  ) => {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    // Retrieve the bill landed cost transaction with associated
    // allocated entries and items.
    const allocatedLandedCost = await BillLandedCost.query(trx)
      .findById(billLandedCostId)
      .withGraphFetched('bill')
      .withGraphFetched('allocateEntries.itemEntry.item');

    // Retrieve the allocated from transaction entry.
    const transactionEntry = await this.getLandedCostEntry(
      tenantId,
      allocatedLandedCost.fromTransactionType,
      allocatedLandedCost.fromTransactionId,
      allocatedLandedCost.fromTransactionEntryId
    );
    // Writes the given landed cost GL entries to the storage layer.
    await this.writeLandedCostGLEntries(
      tenantId,
      allocatedLandedCost,
      allocatedLandedCost.bill,
      transactionEntry,
      trx
    );
  };

  /**
   * Reverts GL entries of the given allocated landed cost transaction.
   * @param {number} tenantId
   * @param {number} landedCostId
   * @param {Knex.Transaction} trx
   */
  public revertLandedCostGLEntries = async (
    tenantId: number,
    landedCostId: number,
    trx: Knex.Transaction
  ) => {
    await this.journalService.revertJournalTransactions(
      tenantId,
      landedCostId,
      'LandedCost',
      trx
    );
  };
}
