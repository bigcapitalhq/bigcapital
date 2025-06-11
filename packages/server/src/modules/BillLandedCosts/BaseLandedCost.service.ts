import { Inject } from '@nestjs/common';
import { difference, sumBy } from 'lodash';
import {
  ILandedCostTransaction,
  ILandedCostTransactionEntry,
  LandedCostTransactionModel,
  LandedCostTransactionType,
} from './types/BillLandedCosts.types';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { BillLandedCost } from './models/BillLandedCost';
import { ServiceError } from '../Items/ServiceError';
import { CONFIG, ERRORS } from './utils';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';
import { Bill } from '../Bills/models/Bill';
import { TransactionLandedCost } from './commands/TransctionLandedCost.service';
import {
  AllocateBillLandedCostDto,
  AllocateBillLandedCostItemDto,
} from './dtos/AllocateBillLandedCost.dto';

export class BaseLandedCostService {
  @Inject()
  protected readonly transactionLandedCost: TransactionLandedCost;

  @Inject(BillLandedCost.name)
  protected readonly billLandedCostModel: TenantModelProxy<
    typeof BillLandedCost
  >;

  /**
   * Validates allocate cost items association with the purchase invoice entries.
   * @param {IItemEntry[]} purchaseInvoiceEntries
   * @param {ILandedCostItemDTO[]} landedCostItems
   */
  protected validateAllocateCostItems = (
    purchaseInvoiceEntries: ItemEntry[],
    landedCostItems: AllocateBillLandedCostItemDto[],
  ): void => {
    // Purchase invoice entries items ids.
    const purchaseInvoiceItems = purchaseInvoiceEntries.map((e) => e.id);
    const landedCostItemsIds = landedCostItems.map((item) => item.entryId);

    // Not found items ids.
    const notFoundItemsIds = difference(
      purchaseInvoiceItems,
      landedCostItemsIds,
    );
    // Throw items ids not found service error.
    if (notFoundItemsIds.length > 0) {
      throw new ServiceError(ERRORS.LANDED_COST_ITEMS_IDS_NOT_FOUND);
    }
  };

  /**
   * Transformes DTO to bill landed cost model object.
   * @param {ILandedCostDTO} landedCostDTO
   * @param {IBill} bill
   * @param {ILandedCostTransaction} costTransaction
   * @param {ILandedCostTransactionEntry} costTransactionEntry
   * @returns
   */
  protected transformToBillLandedCost(
    landedCostDTO: AllocateBillLandedCostDto,
    bill: Bill,
    costTransaction: ILandedCostTransaction,
    costTransactionEntry: ILandedCostTransactionEntry,
  ) {
    const amount = sumBy(landedCostDTO.items, 'cost');

    return {
      billId: bill.id,

      fromTransactionType: landedCostDTO.transactionType,
      fromTransactionId: landedCostDTO.transactionId,
      fromTransactionEntryId: landedCostDTO.transactionEntryId,

      amount,
      currencyCode: costTransaction.currencyCode,
      exchangeRate: costTransaction.exchangeRate || 1,

      allocationMethod: landedCostDTO.allocationMethod,
      allocateEntries: landedCostDTO.items,

      description: landedCostDTO.description,
      costAccountId: costTransactionEntry.costAccountId,
    };
  }

  /**
   * Retrieve the cost transaction or throw not found error.
   * @param {number} tenantId
   * @param {transactionType} transactionType -
   * @param {transactionId} transactionId -
   */
  public getLandedCostOrThrowError = async (
    transactionType: LandedCostTransactionType,
    transactionId: number,
  ) => {
    const Model = await this.transactionLandedCost.getModel(transactionType);
    const model = await Model().query().findById(transactionId);

    if (!model) {
      throw new ServiceError(ERRORS.LANDED_COST_TRANSACTION_NOT_FOUND);
    }
    return this.transactionLandedCost.transformToLandedCost(
      transactionType,
      model as LandedCostTransactionModel,
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
    transactionType: string,
    transactionId: number,
    transactionEntryId: number,
  ): Promise<any> => {
    const Model = await this.transactionLandedCost.getModel(transactionType);
    const relation = CONFIG.COST_TYPES[transactionType].entries;

    const entry = await Model()
      .relatedQuery(relation)
      .for(transactionId)
      .findOne('id', transactionEntryId)
      .where('landedCost', true)
      .onBuild((q) => {
        if (transactionType === 'Bill') {
          q.withGraphFetched('item');
        } else if (transactionType === 'Expense') {
          q.withGraphFetched('expenseAccount');
        }
      });

    if (!entry) {
      throw new ServiceError(ERRORS.LANDED_COST_ENTRY_NOT_FOUND);
    }
    return this.transactionLandedCost.transformToLandedCostEntry(
      transactionType as LandedCostTransactionType,
      entry,
    );
  };

  /**
   * Retrieve allocate items cost total.
   * @param {ILandedCostDTO} landedCostDTO
   * @returns {number}
   */
  protected getAllocateItemsCostTotal = (
    landedCostDTO: AllocateBillLandedCostDto,
  ): number => {
    return sumBy(landedCostDTO.items, 'cost');
  };

  /**
   * Validates the landed cost entry amount.
   * @param {number} unallocatedCost -
   * @param {number} amount -
   */
  protected validateLandedCostEntryAmount = (
    unallocatedCost: number,
    amount: number,
  ): void => {
    if (unallocatedCost < amount) {
      throw new ServiceError(ERRORS.COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT);
    }
  };

  /**
   * Retrieve the give bill landed cost or throw not found service error.
   * @param {number} tenantId - Tenant id.
   * @param {number} landedCostId - Landed cost id.
   * @returns {Promise<IBillLandedCost>}
   */
  public getBillLandedCostOrThrowError = async (
    landedCostId: number,
  ): Promise<BillLandedCost> => {
    // Retrieve the bill landed cost model.
    const billLandedCost = await this.billLandedCostModel()
      .query()
      .findById(landedCostId);

    if (!billLandedCost) {
      throw new ServiceError(ERRORS.BILL_LANDED_COST_NOT_FOUND);
    }
    return billLandedCost;
  };
}
