import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  IAllocatedLandedCostCreatedPayload,
  IBillLandedCost,
  ILandedCostDTO,
} from '@/interfaces';
import BaseLandedCostService from './BaseLandedCost';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class AllocateLandedCost extends BaseLandedCostService {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * =================================
   * - Allocate landed cost.
   * =================================
   * - Validates the allocate cost not the same purchase invoice id.
   * - Get the given bill (purchase invoice) or throw not found error.
   * - Get the given landed cost transaction or throw not found error.
   * - Validate landed cost transaction has enough unallocated cost amount.
   * - Validate landed cost transaction entry has enough unallocated cost amount.
   * - Validate allocate entries existence and associated with cost bill transaction.
   * - Writes inventory landed cost transaction.
   * - Increment the allocated landed cost transaction.
   * - Increment the allocated landed cost transaction entry.
   * --------------------------------
   * @param {ILandedCostDTO} landedCostDTO - Landed cost DTO.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Purchase invoice id.
   */
  public allocateLandedCost = async (
    tenantId: number,
    allocateCostDTO: ILandedCostDTO,
    billId: number
  ): Promise<IBillLandedCost> => {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    // Retrieve total cost of allocated items.
    const amount = this.getAllocateItemsCostTotal(allocateCostDTO);

    // Retrieve the purchase invoice or throw not found error.
    const bill = await this.billsService.getBillOrThrowError(tenantId, billId);

    // Retrieve landed cost transaction or throw not found service error.
    const costTransaction = await this.getLandedCostOrThrowError(
      tenantId,
      allocateCostDTO.transactionType,
      allocateCostDTO.transactionId
    );
    // Retrieve landed cost transaction entries.
    const costTransactionEntry = await this.getLandedCostEntry(
      tenantId,
      allocateCostDTO.transactionType,
      allocateCostDTO.transactionId,
      allocateCostDTO.transactionEntryId
    );
    // Validates allocate cost items association with the purchase invoice entries.
    this.validateAllocateCostItems(bill.entries, allocateCostDTO.items);

    // Validate the amount of cost with unallocated landed cost.
    this.validateLandedCostEntryAmount(
      costTransactionEntry.unallocatedCostAmount,
      amount
    );
    // Transforms DTO to bill landed cost model object.
    const billLandedCostObj = this.transformToBillLandedCost(
      allocateCostDTO,
      bill,
      costTransaction,
      costTransactionEntry
    );
    // Saves landed cost transactions with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Save the bill landed cost model.
      const billLandedCost = await BillLandedCost.query(trx).insertGraph(
        billLandedCostObj
      );
      // Triggers `onBillLandedCostCreated` event.
      await this.eventPublisher.emitAsync(events.billLandedCost.onCreated, {
        tenantId,
        bill,
        billLandedCostId: billLandedCost.id,
        billLandedCost,
        costTransaction,
        costTransactionEntry,
        trx,
      } as IAllocatedLandedCostCreatedPayload);

      return billLandedCost;
    });
  };
}
