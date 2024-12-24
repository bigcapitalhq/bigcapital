import moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../Bills.constants';
import { BillsValidators } from './BillsValidators.service';
import { IBillOpenedPayload, IBillOpeningPayload } from '../Bills.types';
import { Bill } from '../models/Bill';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';

@Injectable()
export class OpenBillService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validators: BillsValidators,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Bill.name)
    private readonly billModel: typeof Bill,
  ) {}

  /**
   * Mark the bill as open.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async openBill(billId: number): Promise<void> {
    // Retrieve the given bill or throw not found error.
    const oldBill = await this.billModel
      .query()
      .findById(billId)
      .withGraphFetched('entries');

    // Validates the bill existence.
    this.validators.validateBillExistance(oldBill);

    if (oldBill.isOpen) {
      throw new ServiceError(ERRORS.BILL_ALREADY_OPEN);
    }

    return this.uow.withTransaction(async (trx) => {
      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onOpening, {
        oldBill,
        trx,
      } as IBillOpeningPayload);

      // Save the bill opened at on the storage.
      const bill = await this.billModel
        .query(trx)
        .patchAndFetchById(billId, {
          openedAt: moment().toMySqlDateTime(),
        })
        .withGraphFetched('entries');

      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onOpened, {
        bill,
        oldBill,
        trx,
      } as IBillOpenedPayload);
    });
  }
}
