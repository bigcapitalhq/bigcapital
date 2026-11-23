import type {
  IInventoryAdjustmentCreatingPayload,
  IInventoryAdjustmentEditingPayload,
  IInventoryAdjustmentPublishingPayload,
} from '@/modules/InventoryAdjutments/types/InventoryAdjustments.types';
import type {
  IWarehouseTransferCreate,
  IWarehouseTransferEditPayload,
  IWarehouseTransferInitiatePayload,
  IWarehouseTransferTransferingPayload,
} from '@/modules/Warehouses/Warehouse.types';
import type {
  IVendorCreditCreatingPayload,
  IVendorCreditEditingPayload,
  IVendorCreditOpeningPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import type {
  ICreditNoteCreatingPayload,
  ICreditNoteEditingPayload,
  ICreditNoteOpeningPayload,
} from '@/modules/CreditNotes/types/CreditNotes.types';
import type {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
  ISaleReceiptEventClosingPayload,
} from '@/modules/SaleReceipts/types/SaleReceipts.types';
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
  public async onBillCreating({ billDTO, trx }: IBillCreatingPayload) {
    await this.validators.validateEntriesBatches(billDTO.entries, {
      trx,
      checkAvailability: false,
    });
  }

  /**
   * Validates the batch ownership of the bill entries on edit.
   */
  @OnEvent(events.bill.onEditing, { suppressErrors: false })
  public async onBillEditing({ billDTO, trx }: IBillEditingPayload) {
    await this.validators.validateEntriesBatches(billDTO.entries, {
      trx,
      checkAvailability: false,
    });
  }

  /**
   * Validates the batch ownership of the bill entries on open.
   */
  @OnEvent(events.bill.onOpening, { suppressErrors: false })
  public async onBillOpening({ oldBill, trx }: IBillOpeningPayload) {
    await this.validators.validateEntriesBatches(oldBill.entries, {
      trx,
      checkAvailability: false,
    });
  }

  /**
   * Validates the availability of the sale invoice entries batches.
   */
  @OnEvent(events.saleInvoice.onCreating, { suppressErrors: false })
  public async onSaleInvoiceCreating({
    saleInvoiceDTO,
    trx,
  }: ISaleInvoiceCreatingPaylaod) {
    await this.validators.validateEntriesBatches(saleInvoiceDTO.entries, {
      trx,
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
    trx,
    oldSaleInvoice,
  }: ISaleInvoiceEditingPayload) {
    await this.validators.validateEntriesBatches(saleInvoiceDTO.entries, {
      trx,
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
    trx,
  }: ISaleInvoiceDeliveringPayload) {
    await this.validators.validateEntriesBatches(oldSaleInvoice.entries, {
      trx,
      checkAvailability: true,
    });
  }

  @OnEvent(events.saleReceipt.onCreating, { suppressErrors: false })
  onSaleReceiptCreating({ saleReceiptDTO, trx }: ISaleReceiptCreatingPayload) {
    return this.validators.validateEntriesBatches(saleReceiptDTO.entries, {
      trx,
      checkAvailability: true,
    });
  }

  @OnEvent(events.saleReceipt.onEditing, { suppressErrors: false })
  onSaleReceiptEditing({
    saleReceiptDTO,
    oldSaleReceipt,
    trx,
  }: ISaleReceiptEditingPayload) {
    return this.validators.validateEntriesBatches(saleReceiptDTO.entries, {
      trx,
      checkAvailability: true,
      referenceType: 'SaleReceipt',
      referenceId: oldSaleReceipt.id,
    });
  }

  @OnEvent(events.saleReceipt.onClosing, { suppressErrors: false })
  onSaleReceiptClosing({
    oldSaleReceipt,
    trx,
  }: ISaleReceiptEventClosingPayload) {
    return this.validators.validateEntriesBatches(oldSaleReceipt.entries, {
      trx,
      checkAvailability: true,
    });
  }

  @OnEvent(events.creditNote.onCreating, { suppressErrors: false })
  onCreditNoteCreating({ creditNoteDTO, trx }: ICreditNoteCreatingPayload) {
    return this.validators.validateEntriesBatches(creditNoteDTO.entries, {
      trx,
    });
  }

  @OnEvent(events.creditNote.onEditing, { suppressErrors: false })
  onCreditNoteEditing({ creditNoteEditDTO, trx }: ICreditNoteEditingPayload) {
    return this.validators.validateEntriesBatches(creditNoteEditDTO.entries, {
      trx,
    });
  }

  @OnEvent(events.creditNote.onOpening, { suppressErrors: false })
  onCreditNoteOpening({ oldCreditNote, trx }: ICreditNoteOpeningPayload) {
    return this.validators.validateEntriesBatches(oldCreditNote.entries, {
      trx,
    });
  }

  @OnEvent(events.vendorCredit.onCreating, { suppressErrors: false })
  onVendorCreditCreating({
    vendorCreditCreateDTO,
    trx,
  }: IVendorCreditCreatingPayload) {
    return this.validators.validateEntriesBatches(
      vendorCreditCreateDTO.entries,
      { trx, checkAvailability: true },
    );
  }

  @OnEvent(events.vendorCredit.onEditing, { suppressErrors: false })
  onVendorCreditEditing({
    vendorCreditDTO,
    oldVendorCredit,
    trx,
  }: IVendorCreditEditingPayload) {
    return this.validators.validateEntriesBatches(vendorCreditDTO.entries, {
      trx,
      checkAvailability: true,
      referenceType: 'VendorCredit',
      referenceId: oldVendorCredit.id,
    });
  }

  @OnEvent(events.vendorCredit.onOpening, { suppressErrors: false })
  onVendorCreditOpening({ oldVendorCredit, trx }: IVendorCreditOpeningPayload) {
    return this.validators.validateEntriesBatches(oldVendorCredit.entries, {
      trx,
      checkAvailability: true,
    });
  }

  @OnEvent(events.warehouseTransfer.onCreate, { suppressErrors: false })
  onWarehouseTransferCreate({
    warehouseTransferDTO,
    trx,
  }: IWarehouseTransferCreate) {
    return this.validators.validateEntriesBatches(
      warehouseTransferDTO.entries,
      { trx, checkAvailability: true },
    );
  }

  @OnEvent(events.warehouseTransfer.onEdit, { suppressErrors: false })
  onWarehouseTransferEdit({
    editWarehouseDTO,
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferEditPayload) {
    return this.validators.validateEntriesBatches(editWarehouseDTO.entries, {
      trx,
      checkAvailability: true,
      referenceType: 'WarehouseTransfer',
      referenceId: oldWarehouseTransfer.id,
    });
  }

  @OnEvent(events.warehouseTransfer.onInitiate, { suppressErrors: false })
  onWarehouseTransferInitiate({
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferInitiatePayload) {
    return this.validators.validateEntriesBatches(
      oldWarehouseTransfer.entries,
      { trx, checkAvailability: true },
    );
  }

  @OnEvent(events.warehouseTransfer.onTransfer, { suppressErrors: false })
  onWarehouseTransferTransfer({
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferTransferingPayload) {
    return this.validators.validateEntriesBatches(
      oldWarehouseTransfer.entries,
      { trx },
    );
  }

  @OnEvent(events.inventoryAdjustment.onQuickCreating, {
    suppressErrors: false,
  })
  onInventoryAdjustmentQuickCreating({
    quickAdjustmentDTO,
    trx,
  }: IInventoryAdjustmentCreatingPayload) {
    return this.validators.validateEntriesBatches([quickAdjustmentDTO], {
      trx,
      checkAvailability: quickAdjustmentDTO.type === 'decrement',
    });
  }

  @OnEvent(events.inventoryAdjustment.onEditing, { suppressErrors: false })
  onInventoryAdjustmentEditing({
    quickAdjustmentDTO,
    oldInventoryAdjustment,
    trx,
  }: IInventoryAdjustmentEditingPayload) {
    return this.validators.validateEntriesBatches([quickAdjustmentDTO], {
      trx,
      checkAvailability: quickAdjustmentDTO.type === 'decrement',
      referenceType: 'InventoryAdjustment',
      referenceId: oldInventoryAdjustment.id,
    });
  }

  @OnEvent(events.inventoryAdjustment.onPublishing, { suppressErrors: false })
  onInventoryAdjustmentPublishing({
    oldInventoryAdjustment,
    trx,
  }: IInventoryAdjustmentPublishingPayload) {
    return this.validators.validateEntriesBatches(
      oldInventoryAdjustment.entries,
      { trx, checkAvailability: oldInventoryAdjustment.type === 'decrement' },
    );
  }
}
