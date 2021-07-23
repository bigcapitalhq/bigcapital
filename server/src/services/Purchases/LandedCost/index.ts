import { Inject, Service } from 'typedi';
import { difference, sumBy } from 'lodash';
import BillsService from '../Bills';
import { ServiceError } from 'exceptions';
import {
  IItemEntry,
  IBill,
  IBillLandedCost,
  ILandedCostItemDTO,
  ILandedCostDTO,
  IBillLandedCostTransaction,
  IBillLandedCostTransactionEntry,
} from 'interfaces';
import InventoryService from 'services/Inventory/Inventory';
import HasTenancyService from 'services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { transformToMap } from 'utils';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import TransactionLandedCost from './TransctionLandedCost';

const CONFIG = {
  COST_TYPES: {
    Expense: {
      entries: 'categories',
    },
    Bill: {
      entries: 'entries',
    },
  },
};

@Service()
export default class AllocateLandedCostService {
  @Inject()
  public billsService: BillsService;

  @Inject()
  public inventoryService: InventoryService;

  @Inject()
  public tenancy: HasTenancyService;

  @Inject('logger')
  public logger: any;

  @Inject()
  public transactionLandedCost: TransactionLandedCost;

  /**
   * Validates allocate cost items association with the purchase invoice entries.
   * @param {IItemEntry[]} purchaseInvoiceEntries
   * @param {ILandedCostItemDTO[]} landedCostItems
   */
  private validateAllocateCostItems = (
    purchaseInvoiceEntries: IItemEntry[],
    landedCostItems: ILandedCostItemDTO[]
  ): void => {
    // Purchase invoice entries items ids.
    const purchaseInvoiceItems = purchaseInvoiceEntries.map((e) => e.id);
    const landedCostItemsIds = landedCostItems.map((item) => item.entryId);

    // Not found items ids.
    const notFoundItemsIds = difference(
      purchaseInvoiceItems,
      landedCostItemsIds
    );
    // Throw items ids not found service error.
    if (notFoundItemsIds.length > 0) {
      throw new ServiceError(ERRORS.LANDED_COST_ITEMS_IDS_NOT_FOUND);
    }
  };

  /**
   * Saves the bill landed cost model.
   * @param {number} tenantId
   * @param {ILandedCostDTO} landedCostDTO
   * @param {number} purchaseInvoiceId
   * @returns {Promise<void>}
   */
  private saveBillLandedCostModel = (
    tenantId: number,
    landedCostDTO: ILandedCostDTO,
    purchaseInvoiceId: number
  ): Promise<IBillLandedCost> => {
    const { BillLandedCost } = this.tenancy.models(tenantId);
    const amount = sumBy(landedCostDTO.items, 'cost');

    // Inserts the bill landed cost to the storage.
    return BillLandedCost.query().insertGraph({
      billId: purchaseInvoiceId,
      fromTransactionType: landedCostDTO.transactionType,
      fromTransactionId: landedCostDTO.transactionId,
      fromTransactionEntryId: landedCostDTO.transactionEntryId,
      amount,
      allocationMethod: landedCostDTO.allocationMethod,
      description: landedCostDTO.description,
      allocateEntries: landedCostDTO.items,
    });
  };

  /**
   * Allocate the landed cost amount to cost transactions.
   * @param {number} tenantId -
   * @param {string} transactionType
   * @param {number} transactionId
   */
  private incrementLandedCostAmount = async (
    tenantId: number,
    transactionType: string,
    transactionId: number,
    transactionEntryId: number,
    amount: number
  ): Promise<void> => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );
    const relation = CONFIG.COST_TYPES[transactionType].entries;

    // Increment the landed cost transaction amount.
    await Model.query()
      .where('id', transactionId)
      .increment('allocatedCostAmount', amount);

    // Increment the landed cost entry.
    await Model.relatedQuery(relation)
      .for(transactionId)
      .where('id', transactionEntryId)
      .increment('allocatedCostAmount', amount);
  };

  /**
   * Reverts the landed cost amount to cost transaction.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType - Transaction type.
   * @param {number} transactionId - Transaction id.
   * @param {number} amount - Amount
   */
  private revertLandedCostAmount = (
    tenantId: number,
    transactionType: string,
    transactionId: number,
    amount: number
  ) => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );

    // Decrement the allocate cost amount of cost transaction.
    return Model.query()
      .where('id', transactionId)
      .decrement('allocatedCostAmount', amount);
  };

  /**
   * Retrieve the cost transaction or throw not found error.
   * @param {number} tenantId
   * @param {transactionType} transactionType -
   * @param {transactionId} transactionId -
   */
  public getLandedCostOrThrowError = async (
    tenantId: number,
    transactionType: string,
    transactionId: number
  ) => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );
    const model = await Model.query().findById(transactionId);

    if (!model) {
      throw new ServiceError(ERRORS.LANDED_COST_TRANSACTION_NOT_FOUND);
    }
    return this.transactionLandedCost.transformToLandedCost(
      transactionType,
      model
    );
  };

  /**
   * Retrieve the landed cost entries.
   * @param {number} tenantId
   * @param {string} transactionType
   * @param {number} transactionId
   * @returns
   */
  public getLandedCostEntry = async (
    tenantId: number,
    transactionType: string,
    transactionId: number,
    transactionEntryId: number
  ): Promise<any> => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );
    const relation = CONFIG.COST_TYPES[transactionType].entries;

    const entry = await Model.relatedQuery(relation)
      .for(transactionId)
      .findOne('id', transactionEntryId)
      .where('landedCost', true);

    if (!entry) {
      throw new ServiceError(ERRORS.LANDED_COST_ENTRY_NOT_FOUND);
    }
    return entry;
  };

  /**
   * Retrieve allocate items cost total.
   * @param {ILandedCostDTO} landedCostDTO
   * @returns {number}
   */
  private getAllocateItemsCostTotal = (
    landedCostDTO: ILandedCostDTO
  ): number => {
    return sumBy(landedCostDTO.items, 'cost');
  };

  /**
   * Validates the landed cost entry amount.
   * @param {number} unallocatedCost -
   * @param {number} amount -
   */
  private validateLandedCostEntryAmount = (
    unallocatedCost: number,
    amount: number
  ): void => {
    console.log(unallocatedCost, amount, '123');

    if (unallocatedCost < amount) {
      throw new ServiceError(ERRORS.COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT);
    }
  };

  /**
   * Merges item entry to bill located landed cost entry.
   * @param {IBillLandedCostTransactionEntry[]} locatedEntries -
   * @param {IItemEntry[]} billEntries -
   * @returns {(IBillLandedCostTransactionEntry & { entry: IItemEntry })[]}
   */
  private mergeLocatedWithBillEntries = (
    locatedEntries: IBillLandedCostTransactionEntry[],
    billEntries: IItemEntry[]
  ): (IBillLandedCostTransactionEntry & { entry: IItemEntry })[] => {
    const billEntriesByEntryId = transformToMap(billEntries, 'id');

    return locatedEntries.map((entry) => ({
      ...entry,
      entry: billEntriesByEntryId.get(entry.entryId),
    }));
  };

  /**
   * Records inventory transactions.
   * @param {number} tenantId
   * @param {} allocateEntries
   */
  private recordInventoryTransactions = async (
    tenantId: number,
    billLandedCost: IBillLandedCostTransaction,
    bill: IBill
  ) => {
    // Retrieve the merged allocated entries with bill entries.
    const allocateEntries = this.mergeLocatedWithBillEntries(
      billLandedCost.allocateEntries,
      bill.entries
    );
    // Mappes the allocate cost entries to inventory transactions.
    const inventoryTransactions = allocateEntries.map((allocateEntry) => ({
      date: bill.billDate,
      itemId: allocateEntry.entry.itemId,
      direction: 'IN',
      quantity: 0,
      rate: allocateEntry.cost,
      transactionType: 'LandedCost',
      transactionId: billLandedCost.id,
      entryId: allocateEntry.entryId,
    }));

    return this.inventoryService.recordInventoryTransactions(
      tenantId,
      inventoryTransactions
    );
  };

  /**
   * =================================
   * Allocate landed cost.
   * =================================
   * - Validates the allocate cost not the same purchase invoice id.
   * - Get the given bill (purchase invoice) or throw not found error.
   * - Get the given landed cost transaction or throw not found error.
   * - Validate landed cost transaction has enough unallocated cost amount.
   * - Validate landed cost transaction entry has enough unallocated cost amount.
   * - Validate allocate entries existance and associated with cost bill transaction.
   * - Writes inventory landed cost transaction.
   * - Increment the allocated landed cost transaction.
   * - Increment the allocated landed cost transaction entry.
   *
   * @param {ILandedCostDTO} landedCostDTO - Landed cost DTO.
   * @param {number} tenantId - Tenant id.
   * @param {number} purchaseInvoiceId - Purchase invoice id.
   */
  public allocateLandedCost = async (
    tenantId: number,
    allocateCostDTO: ILandedCostDTO,
    purchaseInvoiceId: number
  ): Promise<{
    billLandedCost: IBillLandedCost;
  }> => {
    // Retrieve total cost of allocated items.
    const amount = this.getAllocateItemsCostTotal(allocateCostDTO);

    // Retrieve the purchase invoice or throw not found error.
    const purchaseInvoice = await this.billsService.getBillOrThrowError(
      tenantId,
      purchaseInvoiceId
    );
    // Retrieve landed cost transaction or throw not found service error.
    const landedCostTransaction = await this.getLandedCostOrThrowError(
      tenantId,
      allocateCostDTO.transactionType,
      allocateCostDTO.transactionId
    );
    // Retrieve landed cost transaction entries.
    const landedCostEntry = await this.getLandedCostEntry(
      tenantId,
      allocateCostDTO.transactionType,
      allocateCostDTO.transactionId,
      allocateCostDTO.transactionEntryId
    );
    // Validates allocate cost items association with the purchase invoice entries.
    this.validateAllocateCostItems(
      purchaseInvoice.entries,
      allocateCostDTO.items
    );
    // Validate the amount of cost with unallocated landed cost.
    this.validateLandedCostEntryAmount(
      landedCostEntry.unallocatedLandedCost,
      amount
    );
    // Save the bill landed cost model.
    const billLandedCost = await this.saveBillLandedCostModel(
      tenantId,
      allocateCostDTO,
      purchaseInvoiceId
    );
    // Records the inventory transactions.
    await this.recordInventoryTransactions(
      tenantId,
      billLandedCost,
      purchaseInvoice
    );
    // Increment landed cost amount on transaction and entry.
    await this.incrementLandedCostAmount(
      tenantId,
      allocateCostDTO.transactionType,
      allocateCostDTO.transactionId,
      allocateCostDTO.transactionEntryId,
      amount
    );
    // Write the landed cost journal entries.
    // await this.writeJournalEntry(tenantId, billLandedCost, purchaseInvoice);

    return { billLandedCost };
  };

  /**
   * Write journal entries of the given purchase invoice landed cost.
   * @param tenantId
   * @param purchaseInvoice
   * @param landedCost
   */
  private writeJournalEntry = async (
    tenantId: number,
    landedCostEntry: any,
    purchaseInvoice: IBill,
    landedCost: IBillLandedCost
  ) => {
    const journal = new JournalPoster(tenantId);
    const billEntriesById = purchaseInvoice.entries;

    const commonEntry = {
      referenceType: 'Bill',
      referenceId: purchaseInvoice.id,
      date: purchaseInvoice.billDate,
      indexGroup: 300,
    };
    const costEntry = new JournalEntry({
      ...commonEntry,
      credit: landedCost.amount,
      account: landedCost.costAccountId,
      index: 1,
    });
    journal.credit(costEntry);

    landedCost.allocateEntries.forEach((entry, index) => {
      const billEntry = billEntriesById[entry.entryId];

      const inventoryEntry = new JournalEntry({
        ...commonEntry,
        debit: entry.cost,
        account: billEntry.item.inventoryAccountId,
        index: 1 + index,
      });
      journal.debit(inventoryEntry);
    });
    return journal;
  };

  /**
   * Retrieve the give bill landed cost or throw not found service error.
   * @param {number} tenantId - Tenant id.
   * @param {number} landedCostId - Landed cost id.
   * @returns {Promise<IBillLandedCost>}
   */
  public getBillLandedCostOrThrowError = async (
    tenantId: number,
    landedCostId: number
  ): Promise<IBillLandedCost> => {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    // Retrieve the bill landed cost model.
    const billLandedCost = await BillLandedCost.query().findById(landedCostId);

    if (!billLandedCost) {
      throw new ServiceError(ERRORS.BILL_LANDED_COST_NOT_FOUND);
    }
    return billLandedCost;
  };

  /**
   * Deletes the landed cost transaction with assocaited allocate entries.
   * @param {number} tenantId
   * @param {number} landedCostId
   */
  public deleteLandedCost = async (
    tenantId: number,
    landedCostId: number
  ): Promise<void> => {
    const { BillLandedCost, BillLandedCostEntry } =
      this.tenancy.models(tenantId);

    // Deletes the bill landed cost allocated entries associated to landed cost.
    await BillLandedCostEntry.query()
      .where('bill_located_cost_id', landedCostId)
      .delete();

    // Delete the bill landed cost from the storage.
    await BillLandedCost.query().where('id', landedCostId).delete();
  };

  /**
   * Deletes the allocated landed cost.
   * ==================================
   * - Delete bill landed cost transaction with associated allocate entries.
   * - Delete the associated inventory transactions.
   * - Decrement allocated amount of landed cost transaction and entry.
   * - Revert journal entries.
   *
   * @param {number} tenantId - Tenant id.
   * @param {number} landedCostId - Landed cost id.
   * @return {Promise<void>}
   */
  public deleteAllocatedLandedCost = async (
    tenantId: number,
    landedCostId: number
  ): Promise<{
    landedCostId: number;
  }> => {
    // Retrieves the bill landed cost.
    const oldBillLandedCost = await this.getBillLandedCostOrThrowError(
      tenantId,
      landedCostId
    );
    // Delete landed cost transaction with assocaited locate entries.
    await this.deleteLandedCost(tenantId, landedCostId);

    // Removes the inventory transactions.
    await this.removeInventoryTransactions(tenantId, landedCostId);

    // Reverts the landed cost amount to the cost transaction.
    await this.revertLandedCostAmount(
      tenantId,
      oldBillLandedCost.fromTransactionType,
      oldBillLandedCost.fromTransactionId,
      oldBillLandedCost.amount
    );
    return { landedCostId };
  };

  /**
   * Deletes the inventory transaction.
   * @param {number} tenantId
   * @param {number} landedCostId
   * @returns
   */
  private removeInventoryTransactions = (tenantId, landedCostId: number) => {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      landedCostId,
      'LandedCost'
    );
  };
}
