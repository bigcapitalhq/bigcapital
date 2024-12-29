import { Inject, Injectable } from '@nestjs/common';
import {
  IVendorCreditOpenedPayload,
  IVendorCreditOpeningPayload,
  IVendorCreditOpenPayload,
} from '../types/VendorCredit.types';
import { ERRORS } from '../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { VendorCredit } from '../models/VendorCredit';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class OpenVendorCreditService {
  /**
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   */
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(VendorCredit.name) private vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Opens the given credit note.
   * @param {number} vendorCreditId -
   * @returns {Promise<IVendorCredit>}
   */
  public openVendorCredit = async (
    vendorCreditId: number,
  ): Promise<VendorCredit> => {
    // Retrieve the vendor credit or throw not found service error.
    const oldVendorCredit = await this.vendorCreditModel
      .query()
      .findById(vendorCreditId)
      .throwIfNotFound();

    // Throw service error if the credit note is already open.
    this.throwErrorIfAlreadyOpen(oldVendorCredit);

    // Triggers `onVendorCreditOpen` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onOpen, {
      vendorCreditId,
      oldVendorCredit,
    } as IVendorCreditOpenPayload);

    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(async (trx) => {
      const eventPayload = {
        vendorCreditId,
        oldVendorCredit,
        trx,
      } as IVendorCreditOpeningPayload;

      // Triggers `onCreditNoteOpening` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onOpening,
        eventPayload as IVendorCreditOpeningPayload,
      );
      // Saves the vendor credit graph to the storage.
      const vendorCredit = await this.vendorCreditModel
        .query(trx)
        .findById(vendorCreditId)
        .update({
          openedAt: new Date(),
        });
      // Triggers `onVendorCreditOpened` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onOpened, {
        ...eventPayload,
        vendorCredit,
      } as IVendorCreditOpenedPayload);

      return vendorCredit;
    });
  };

  /**
   * Throw error if the vendor credit is already open.
   * @param {IVendorCredit} vendorCredit
   */
  public throwErrorIfAlreadyOpen = (vendorCredit: VendorCredit) => {
    if (vendorCredit.openedAt) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_ALREADY_OPENED);
    }
  };
}
