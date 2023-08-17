import moment from 'moment';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { BillsValidators } from './BillsValidators';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { IBillOpenedPayload, IBillOpeningPayload } from '@/interfaces';

@Service()
export class OpenBill {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: BillsValidators;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Mark the bill as open.
   * @param {number} tenantId
   * @param {number} billId
   */
  public async openBill(tenantId: number, billId: number): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);

    // Retrieve the given bill or throw not found error.
    const oldBill = await Bill.query()
      .findById(billId)
      .withGraphFetched('entries');

    // Validates the bill existance.
    this.validators.validateBillExistance(oldBill);

    if (oldBill.isOpen) {
      throw new ServiceError(ERRORS.BILL_ALREADY_OPEN);
    }
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onOpening, {
        trx,
        tenantId,
        oldBill,
      } as IBillOpeningPayload);

      // Save the bill opened at on the storage.
      const bill = await Bill.query(trx)
        .patchAndFetchById(billId, {
          openedAt: moment().toMySqlDateTime(),
        })
        .withGraphFetched('entries');

      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onOpened, {
        trx,
        bill,
        oldBill,
        tenantId,
      } as IBillOpenedPayload);
    });
  }
}
