import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import {
  ISaleInvoiceWriteoffCreatePayload,
  ISaleInvoiceWriteoffDTO,
  ISaleInvoiceWrittenOffCanceledPayload,
  ISaleInvoiceWrittenOffCancelPayload,
} from '../SaleInvoice.types';
import { ERRORS } from '../constants';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators.service';
import { SaleInvoice } from '../models/SaleInvoice';
import { events } from '@/common/events/events';
import { ServiceError } from '../../Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class WriteoffSaleInvoice {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandSaleInvoiceValidators} validators - Command sale invoice validators.
   * @param {typeof SaleInvoice} saleInvoiceModel - Sale invoice model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandSaleInvoiceValidators,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Writes-off the sale invoice on bad debt expense account.
   * @param {number} saleInvoiceId
   * @param {ISaleInvoiceWriteoffDTO} writeoffDTO
   * @return {Promise<ISaleInvoice>}
   */
  public writeOff = async (
    saleInvoiceId: number,
    writeoffDTO: ISaleInvoiceWriteoffDTO,
  ): Promise<SaleInvoice> => {
    // Saves the invoice write-off transaction with associated transactions
    // under unit-of-work envirmenet.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the write-off operation against the locked invoice row.
      const saleInvoice = await this.validate(saleInvoiceId, trx, false);

      const eventPayload = {
        // tenantId,
        saleInvoiceId,
        saleInvoice,
        writeoffDTO,
        trx,
      } as ISaleInvoiceWriteoffCreatePayload;

      // Triggers `onSaleInvoiceWriteoff` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWriteoff,
        eventPayload,
      );
      // Mark the sale invoice as written-off.
      const newSaleInvoice = await this.saleInvoiceModel()
        .query(trx)
        .patch({
          writtenoffExpenseAccountId: writeoffDTO.expenseAccountId,
          writtenoffAmount: saleInvoice.dueAmount,
          writtenoffAt: new Date(),
        })
        .findById(saleInvoiceId);

      // Triggers `onSaleInvoiceWrittenoff` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoff,
        eventPayload,
      );
      return newSaleInvoice;
    });
  };

  /**
   * Cancels the written-off sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<ISaleInvoice>}
   */
  public cancelWrittenoff = async (
    saleInvoiceId: number,
  ): Promise<SaleInvoice> => {
    // Cancels the invoice written-off and removes the associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the cancel written-off operation against the locked invoice row.
      const saleInvoice = await this.validate(saleInvoiceId, trx, true);

      // Triggers `onSaleInvoiceWrittenoffCancel` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoffCancel,
        {
          saleInvoice,
          trx,
        } as ISaleInvoiceWrittenOffCancelPayload,
      );
      // Mark the sale invoice as written-off.
      const newSaleInvoice = await this.saleInvoiceModel()
        .query(trx)
        .patch({
          writtenoffAmount: null,
          writtenoffAt: null,
        })
        .findById(saleInvoiceId);

      // Triggers `onSaleInvoiceWrittenoffCanceled`.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoffCanceled,
        {
          saleInvoice,
          trx,
        } as ISaleInvoiceWrittenOffCanceledPayload,
      );
      return newSaleInvoice;
    });
  };

  /**
   * Validates the write-off / cancel written-off operation against the locked
   * invoice row: existence and the expected written-off state.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx - Locks the invoice row (FOR UPDATE).
   * @param {boolean} expectWrittenoff - Expected written-off state.
   * @returns {Promise<SaleInvoice>} The locked sale invoice.
   */
  async validate(
    saleInvoiceId: number,
    trx: Knex.Transaction,
    expectWrittenoff: boolean,
  ): Promise<SaleInvoice> {
    // Re-read the invoice with a row lock to validate against current state.
    const saleInvoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(saleInvoiceId)
      .forUpdate()
      .throwIfNotFound();

    // Validate the sale invoice written-off state against the locked row.
    if (expectWrittenoff) {
      this.validateSaleInvoiceNotWrittenoff(saleInvoice);
    } else {
      this.validateSaleInvoiceAlreadyWrittenoff(saleInvoice);
    }
    return saleInvoice;
  }

  /**
   * Should sale invoice not be written-off.
   * @param {SaleInvoice} saleInvoice
   */
  private validateSaleInvoiceNotWrittenoff(saleInvoice: SaleInvoice) {
    if (!saleInvoice.isWrittenoff) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_WRITTEN_OFF);
    }
  }

  /**
   * Should sale invoice already written-off.
   * @param {SaleInvoice} saleInvoice
   */
  private validateSaleInvoiceAlreadyWrittenoff(saleInvoice: SaleInvoice) {
    if (saleInvoice.isWrittenoff) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_WRITTEN_OFF);
    }
  }
}
