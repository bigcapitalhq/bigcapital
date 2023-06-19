import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  ISaleInvoice,
  ISaleInvoiceWriteoffCreatePayload,
  ISaleInvoiceWriteoffDTO,
  ISaleInvoiceWrittenOffCanceledPayload,
  ISaleInvoiceWrittenOffCancelPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { ServiceError } from '@/exceptions';

import JournalPosterService from './JournalPosterService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

const ERRORS = {
  SALE_INVOICE_ALREADY_WRITTEN_OFF: 'SALE_INVOICE_ALREADY_WRITTEN_OFF',
  SALE_INVOICE_NOT_WRITTEN_OFF: 'SALE_INVOICE_NOT_WRITTEN_OFF',
};

@Service()
export default class SaleInvoiceWriteoff {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  uow: UnitOfWork;

  /**
   * Writes-off the sale invoice on bad debt expense account.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISaleInvoiceWriteoffDTO} writeoffDTO
   * @return {Promise<ISaleInvoice>}
   */
  public writeOff = async (
    tenantId: number,
    saleInvoiceId: number,
    writeoffDTO: ISaleInvoiceWriteoffDTO
  ): Promise<ISaleInvoice> => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Validate the sale invoice existence.
    // Retrieve the sale invoice or throw not found service error.
    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .throwIfNotFound();

    // Validate the sale invoice whether already written-off.
    this.validateSaleInvoiceAlreadyWrittenoff(saleInvoice);

    // Saves the invoice write-off transaction with associated transactions 
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        tenantId,
        saleInvoiceId,
        saleInvoice,
        writeoffDTO,
        trx,
      } as ISaleInvoiceWriteoffCreatePayload;

      // Triggers `onSaleInvoiceWriteoff` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWriteoff,
        eventPayload
      );
      // Mark the sale invoice as written-off.
      const newSaleInvoice = await SaleInvoice.query(trx)
        .patch({
          writtenoffExpenseAccountId: writeoffDTO.expenseAccountId,
          writtenoffAmount: saleInvoice.dueAmount,
          writtenoffAt: new Date(),
        })
        .findById(saleInvoiceId);

      // Triggers `onSaleInvoiceWrittenoff` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoff,
        eventPayload
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
    tenantId: number,
    saleInvoiceId: number
  ): Promise<ISaleInvoice> => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Validate the sale invoice existence.
    // Retrieve the sale invoice or throw not found service error.
    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .throwIfNotFound();

    // Validate the sale invoice whether already written-off.
    this.validateSaleInvoiceNotWrittenoff(saleInvoice);

    // Cancels the invoice written-off and removes the associated transactions.
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onSaleInvoiceWrittenoffCancel` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onWrittenoffCancel,
        {
          tenantId,
          saleInvoice,
          trx,
        } as ISaleInvoiceWrittenOffCancelPayload
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
          tenantId,
          saleInvoice,
          trx,
        } as ISaleInvoiceWrittenOffCanceledPayload
      );
      return newSaleInvoice;
    });
  };

  /**
   * Should sale invoice not be written-off.
   * @param {ISaleInvoice} saleInvoice
   */
  private validateSaleInvoiceNotWrittenoff(saleInvoice: ISaleInvoice) {
    if (!saleInvoice.isWrittenoff) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_WRITTEN_OFF);
    }
  }

  /**
   * Should sale invoice already written-off.
   * @param {ISaleInvoice} saleInvoice
   */
  private validateSaleInvoiceAlreadyWrittenoff(saleInvoice: ISaleInvoice) {
    if (saleInvoice.isWrittenoff) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_WRITTEN_OFF);
    }
  }
}
