import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { events } from '@/common/events/events';
import {
  IBIllEventDeletedPayload,
  IBillEventDeletingPayload,
} from '../Bills.types';
import { BillsValidators } from './BillsValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Bill } from '../models/Bill';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteBill {
  constructor(
    private readonly validators: BillsValidators,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Deletes the bill with associated entries.
   * @param {number} billId
   * @param {Knex.Transaction} trx - Database transaction instance.
   * @return {void}
   */
  public async deleteBill(billId: number, trx?: Knex.Transaction) {
    // Retrieve the given bill or throw not found error.
    const oldBill = await this.billModel()
      .query()
      .findById(billId)
      .withGraphFetched('entries');

    // Validates the bill existence.
    this.validators.validateBillExistance(oldBill);

    // Validate the given bill has no associated landed cost transactions.
    await this.validators.validateBillHasNoLandedCost(billId);

    // Validate the purchase bill has no associated payments transactions.
    await this.validators.validateBillHasNoEntries(billId);

    // Validate the given bill has no associated reconciled with vendor credits.
    await this.validators.validateBillHasNoAppliedToCredit(billId);

    // Deletes bill transaction with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillDeleting` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleting, {
        trx,
        oldBill,
      } as IBillEventDeletingPayload);

      // Delete all associated bill entries.
      await this.itemEntryModel()
        .query(trx)
        .where('reference_type', 'Bill')
        .where('reference_id', billId)
        .delete();

      // Delete the bill transaction.
      await Bill.query(trx).findById(billId).delete();

      // Triggers `onBillDeleted` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleted, {
        billId,
        oldBill,
        trx,
      } as IBIllEventDeletedPayload);
    }, trx);
  }
}
