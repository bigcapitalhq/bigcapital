import * as R from 'ramda';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { BaseLandedCostService } from '../BaseLandedCost.service';
import { BillLandedCost } from '../models/BillLandedCost';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Bill } from '@/modules/Bills/models/Bill';
import { BillLandedCostEntry } from '../models/BillLandedCostEntry';
import { ILedger, ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';

@Injectable()
export class LandedCostGLEntries extends BaseLandedCostService {
  constructor(
    private readonly journalService: JournalPosterService,
    private readonly ledgerRepository: LedgerRepository,

    @Inject(BillLandedCost.name)
    private readonly billLandedCostModel: TenantModelProxy<typeof BillLandedCost>,
  ) {
    super();
  }

  /**
   * Retrieves the landed cost GL common entry.
   * @param {IBill} bill
   * @param {IBillLandedCost} allocatedLandedCost
   * @returns
   */
  private getLandedCostGLCommonEntry = (
    bill: Bill,
    allocatedLandedCost: BillLandedCost
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
   * @param {IBill} bill
   * @param {IBillLandedCost} allocatedLandedCost
   * @param {IBillLandedCostEntry} allocatedEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLInventoryEntry = (
    bill: Bill,
    allocatedLandedCost: BillLandedCost,
    allocatedEntry: BillLandedCostEntry
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
   * @param {IBill} bill
   * @param {IBillLandedCost} allocatedLandedCost
   * @param {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLCostEntry = (
    bill: Bill,
    allocatedLandedCost: BillLandedCost,
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
   * @param {IBill} bill
   * @param {IBillLandedCost} allocatedLandedCost
   * @param {ILandedCostTransactionEntry} fromTransactionEntry
   * @param {IBillLandedCostEntry} allocatedEntry
   * @returns {ILedgerEntry}
   */
  private getLandedCostGLAllocateEntry = R.curry(
    (
      bill: Bill,
      allocatedLandedCost: BillLandedCost,
      fromTransactionEntry: LandedCostTransactionEntry,
      allocatedEntry: BillLandedCostEntry
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
   * @param {BillLandedCost} allocatedLandedCost
   * @param {Bill} bill
   * @param {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedgerEntry[]}
   */
  public getLandedCostGLEntries = (
    allocatedLandedCost: BillLandedCost,
    bill: Bill,
    fromTransactionEntry: LandedCostTransactionEntry
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
   * @param   {Bill} bill
   * @param   {ILandedCostTransactionEntry} fromTransactionEntry
   * @returns {ILedger}
   */
  public getLandedCostLedger = (
    allocatedLandedCost: BillLandedCost,
    bill: Bill,
    fromTransactionEntry: LandedCostTransactionEntry
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
    allocatedLandedCost: BillLandedCost,
    bill: Bill,
    fromTransactionEntry: ILandedCostTransactionEntry,
    trx?: Knex.Transaction
  ) => {
    const ledgerEntries = this.getLandedCostGLEntries(
      allocatedLandedCost,
      bill,
      fromTransactionEntry
    );
    await this.ledgerRepository.saveLedgerEntries(ledgerEntries, trx);
  };

  /**
   * Generates and writes GL entries of the given landed cost.
   * @param {number} billLandedCostId
   * @param {Knex.Transaction} trx
   */
  public createLandedCostGLEntries = async (
    billLandedCostId: number,
    trx?: Knex.Transaction
  ) => {
    // Retrieve the bill landed cost transacion with associated
    // allocated entries and items.
    const allocatedLandedCost = await this.billLandedCostModel().query(trx)
      .findById(billLandedCostId)
      .withGraphFetched('bill')
      .withGraphFetched('allocateEntries.itemEntry.item');

    // Retrieve the allocated from transactione entry.
    const transactionEntry = await this.getLandedCostEntry(
      allocatedLandedCost.fromTransactionType,
      allocatedLandedCost.fromTransactionId,
      allocatedLandedCost.fromTransactionEntryId
    );
    // Writes the given landed cost GL entries to the storage layer.
    await this.writeLandedCostGLEntries(
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
    landedCostId: number,
    trx: Knex.Transaction
  ) => {
    await this.journalService.revertJournalTransactions(
      landedCostId,
      'LandedCost',
      trx
    );
  };
}