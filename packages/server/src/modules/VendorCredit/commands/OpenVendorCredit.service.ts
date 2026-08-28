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
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

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

    @Inject(VendorCredit.name)
    private vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Opens the given credit note.
   * @param {number} vendorCreditId -
   * @returns {Promise<IVendorCredit>}
   */
  public openVendorCredit = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ): Promise<VendorCredit> => {
    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(async (trx) => {
      // Validates the open operation against the locked vendor credit row.
      const oldVendorCredit = await this.validate(vendorCreditId, trx);

      // Triggers `onVendorCreditOpen` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onOpen, {
        vendorCreditId,
        oldVendorCredit,
      } as IVendorCreditOpenPayload);

      const eventPayload = {
        vendorCreditId,
        oldVendorCredit,
        trx,
      } as IVendorCreditOpeningPayload;

      // Triggers `onVendorCreditOpening` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onOpening,
        eventPayload as IVendorCreditOpeningPayload,
      );
      // Saves the vendor credit graph to the storage.
      const vendorCredit = await this.vendorCreditModel()
        .query(trx)
        .findById(vendorCreditId)
        .updateAndFetchById(vendorCreditId, {
          openedAt: new Date(),
        })
        .withGraphFetched('entries');
      // Triggers `onVendorCreditOpened` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onOpened, {
        ...eventPayload,
        vendorCredit,
      } as IVendorCreditOpenedPayload);

      return vendorCredit;
    }, trx);
  };

  /**
   * Validates the open vendor credit operation against the locked vendor
   * credit row: existence and not already open.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {Knex.Transaction} trx - Locks the vendor credit row (FOR UPDATE).
   * @returns {Promise<VendorCredit>} The locked vendor credit.
   */
  validate = async (
    vendorCreditId: number,
    trx: Knex.Transaction,
  ): Promise<VendorCredit> => {
    // Retrieve the vendor credit with a row lock or throw not found service error.
    const oldVendorCredit = await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .forUpdate()
      .throwIfNotFound();

    // Throw service error if the credit note is already open.
    this.throwErrorIfAlreadyOpen(oldVendorCredit);
    return oldVendorCredit;
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
