import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { BatchesValidators } from './BatchesValidators.service';
import type {
  IBillCreatingPayload,
  IBillEditingPayload,
  IBillOpeningPayload,
} from '@/modules/Bills/Bills.types';
import type {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
  ISaleInvoiceDeliveringPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';

@Injectable()
export class BatchesSubscriber {
  constructor(private readonly validators: BatchesValidators) {}

  /**
   * Validates the batch ownership of the bill entries.
   */
  @OnEvent(events.bill.onCreating, { suppressErrors: false })
  public async onBillCreating({ billDTO }: IBillCreatingPayload) {
    await this.validators.validateEntriesBatches(billDTO.entries, {
      checkAvailability: false,
    });
  }

  /**
   * Validates the batch ownership of the bill entries on edit.
   */
  @OnEvent(events.bill.onEditing, { suppressErrors: false })
  public async onBillEditing({ billDTO }: IBillEditingPayload) {
    await this.validators.validateEntriesBatches(billDTO.entries, {
      checkAvailability: false,
    });
  }

  /**
   * Validates the batch ownership of the bill entries on open.
   */
  @OnEvent(events.bill.onOpening, { suppressErrors: false })
  public async onBillOpening({ oldBill }: IBillOpeningPayload) {
    await this.validators.validateEntriesBatches(oldBill.entries, {
      checkAvailability: false,
    });
  }

  /**
   * Validates the availability of the sale invoice entries batches.
   */
  @OnEvent(events.saleInvoice.onCreating, { suppressErrors: false })
  public async onSaleInvoiceCreating({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) {
    await this.validators.validateEntriesBatches(saleInvoiceDTO.entries, {
      checkAvailability: true,
    });
  }

  /**
   * Validates the availability of the sale invoice entries batches on edit.
   * The old invoice consumption is excluded from the available quantity.
   */
  @OnEvent(events.saleInvoice.onEditing, { suppressErrors: false })
  public async onSaleInvoiceEditing({
    saleInvoiceDTO,
    oldSaleInvoice,
  }: ISaleInvoiceEditingPayload) {
    await this.validators.validateEntriesBatches(saleInvoiceDTO.entries, {
      checkAvailability: true,
      referenceType: 'SaleInvoice',
      referenceId: oldSaleInvoice.id,
    });
  }

  /**
   * Validates the availability of the sale invoice batches on delivery.
   */
  @OnEvent(events.saleInvoice.onDelivering, { suppressErrors: false })
  public async onSaleInvoiceDelivering({
    oldSaleInvoice,
  }: ISaleInvoiceDeliveringPayload) {
    await this.validators.validateEntriesBatches(oldSaleInvoice.entries, {
      checkAvailability: true,
    });
  }
}
