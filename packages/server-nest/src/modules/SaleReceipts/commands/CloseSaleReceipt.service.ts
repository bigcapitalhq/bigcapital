import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Knex } from 'knex';
import {
  ISaleReceiptEventClosedPayload,
  ISaleReceiptEventClosingPayload,
} from '../types/SaleReceipts.types';
import { SaleReceiptValidators } from './SaleReceiptValidators.service';
import { SaleReceipt } from '../models/SaleReceipt';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class CloseSaleReceipt {
  /**
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {SaleReceiptValidators} validators - Sale receipt validators.
   * @param {typeof SaleReceipt} saleReceiptModel - Sale receipt model.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: SaleReceiptValidators,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: typeof SaleReceipt,
  ) {}

  /**
   * Mark the given sale receipt as closed.
   * @param {number} saleReceiptId - Sale receipt identifier.
   * @return {Promise<void>}
   */
  public async closeSaleReceipt(saleReceiptId: number): Promise<void> {
    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await this.saleReceiptModel
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Throw service error if the sale receipt already closed.
    this.validators.validateReceiptNotClosed(oldSaleReceipt);

    // Updates the sale receipt transaction under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptClosing` event.
      await this.eventEmitter.emitAsync(events.saleReceipt.onClosing, {
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventClosingPayload);

      // Mark the sale receipt as closed on the storage.
      const saleReceipt = await this.saleReceiptModel
        .query(trx)
        .patchAndFetchById(saleReceiptId, {
          closedAt: moment().toMySqlDateTime(),
        });
        
      // Triggers `onSaleReceiptClosed` event.
      await this.eventEmitter.emitAsync(events.saleReceipt.onClosed, {
        saleReceiptId,
        saleReceipt,
        trx,
      } as ISaleReceiptEventClosedPayload);
    });
  }
}
