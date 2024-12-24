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

@Injectable()
export class WriteoffSaleInvoice {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: CommandSaleInvoiceValidators,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: typeof SaleInvoice,
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
    const saleInvoice = await this.saleInvoiceModel
      .query()
      .findById(saleInvoiceId)
      .throwIfNotFound();

    // Validates the given invoice existance.
    this.validators.validateInvoiceExistance(saleInvoice);

    // Validate the sale invoice whether already written-off.
    this.validateSaleInvoiceAlreadyWrittenoff(saleInvoice);

    // Saves the invoice write-off transaction with associated transactions
    // under unit-of-work envirmenet.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
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
      const newSaleInvoice = await this.saleInvoiceModel
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
    // Validate the sale invoice existance.

    // Retrieve the sale invoice or throw not found service error.
    const saleInvoice = await this.saleInvoiceModel
      .query()
      .findById(saleInvoiceId);

    // Validate the sale invoice existance.
    this.validators.validateInvoiceExistance(saleInvoice);

    // Validate the sale invoice whether already written-off.
    this.validateSaleInvoiceNotWrittenoff(saleInvoice);

    // Cancels the invoice written-off and removes the associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceWrittenoffCancel` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoffCancel,
        {
          saleInvoice,
          trx,
        } as ISaleInvoiceWrittenOffCancelPayload,
      );
      // Mark the sale invoice as written-off.
      const newSaleInvoice = await SaleInvoice.query(trx)
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
