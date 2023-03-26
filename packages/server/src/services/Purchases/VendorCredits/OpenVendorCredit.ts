import { ServiceError } from '@/exceptions';
import {
  IVendorCredit,
  IVendorCreditOpenedPayload,
  IVendorCreditOpeningPayload,
  IVendorCreditOpenPayload,
} from '@/interfaces';
import Knex from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import BaseVendorCredit from './BaseVendorCredit';
import { ERRORS } from './constants';

@Service()
export default class OpenVendorCredit extends BaseVendorCredit {
  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  uow: UnitOfWork;

  /**
   * Opens the given credit note.
   * @param {number} tenantId -
   * @param {ICreditNoteEditDTO} creditNoteEditDTO -
   * @returns {Promise<ICreditNote>}
   */
  public openVendorCredit = async (
    tenantId: number,
    vendorCreditId: number
  ): Promise<IVendorCredit> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Retrieve the vendor credit or throw not found service error.
    const oldVendorCredit = await this.getVendorCreditOrThrowError(
      tenantId,
      vendorCreditId
    );
    // Throw service error if the credit note is already open.
    this.throwErrorIfAlreadyOpen(oldVendorCredit);

    // Triggers `onVendorCreditOpen` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onOpen, {
      tenantId,
      vendorCreditId,
      oldVendorCredit,
    } as IVendorCreditOpenPayload);

    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        tenantId,
        vendorCreditId,
        oldVendorCredit,
        trx,
      } as IVendorCreditOpeningPayload;

      // Triggers `onCreditNoteOpening` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onOpening,
        eventPayload as IVendorCreditOpeningPayload
      );
      // Saves the vendor credit graph to the storage.
      const vendorCredit = await VendorCredit.query(trx)
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
  public throwErrorIfAlreadyOpen = (vendorCredit: IVendorCredit) => {
    if (vendorCredit.openedAt) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_ALREADY_OPENED);
    }
  };
}
