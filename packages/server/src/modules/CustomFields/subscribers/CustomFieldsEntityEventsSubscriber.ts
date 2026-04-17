import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SaveCustomFieldValuesService } from '../queries/SaveCustomFieldValues.service';
import { events } from '@/common/events/events';

@Injectable()
export class CustomFieldsEntityEventsSubscriber {
  constructor(
    private readonly saveCustomFieldValuesService: SaveCustomFieldValuesService,
  ) {}

  // --- Sale Invoices ---
  @OnEvent(events.saleInvoice.onCreated)
  async handleSaleInvoiceCreated(payload: any) {
    if (payload.saleInvoiceDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleInvoice',
        payload.saleInvoiceId,
        payload.saleInvoiceDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.saleInvoice.onEdited)
  async handleSaleInvoiceEdited(payload: any) {
    if (payload.saleInvoiceDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleInvoice',
        payload.saleInvoiceId,
        payload.saleInvoiceDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Sale Estimates ---
  @OnEvent(events.saleEstimate.onCreated)
  async handleSaleEstimateCreated(payload: any) {
    if (payload.saleEstimateDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleEstimate',
        payload.saleEstimateId,
        payload.saleEstimateDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.saleEstimate.onEdited)
  async handleSaleEstimateEdited(payload: any) {
    if (payload.estimateDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleEstimate',
        payload.estimateId,
        payload.estimateDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Sale Receipts ---
  @OnEvent(events.saleReceipt.onCreated)
  async handleSaleReceiptCreated(payload: any) {
    if (payload.saleReceiptDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleReceipt',
        payload.saleReceiptId,
        payload.saleReceiptDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.saleReceipt.onEdited)
  async handleSaleReceiptEdited(payload: any) {
    if (payload.saleReceiptDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'SaleReceipt',
        payload.saleReceipt.id,
        payload.saleReceiptDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Customers ---
  @OnEvent(events.customers.onCreated)
  async handleCustomerCreated(payload: any) {
    if (payload.customerDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'Customer',
        payload.customerId,
        payload.customerDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.customers.onEdited)
  async handleCustomerEdited(payload: any) {
    if (payload.customerDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'Customer',
        payload.customerId,
        payload.customerDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Items ---
  @OnEvent(events.item.onCreated)
  async handleItemCreated(payload: any) {
    if (payload.itemDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'Item',
        payload.itemId,
        payload.itemDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.item.onEdited)
  async handleItemEdited(payload: any) {
    if (payload.itemDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'Item',
        payload.itemId,
        payload.itemDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Credit Notes ---
  @OnEvent(events.creditNote.onCreated)
  async handleCreditNoteCreated(payload: any) {
    if (payload.creditNoteDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'CreditNote',
        payload.creditNote.id,
        payload.creditNoteDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.creditNote.onEdited)
  async handleCreditNoteEdited(payload: any) {
    if (payload.creditNoteEditDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'CreditNote',
        payload.creditNoteId,
        payload.creditNoteEditDTO.customFields,
        payload.trx,
      );
    }
  }

  // --- Payment Received ---
  @OnEvent(events.paymentReceive.onCreated)
  async handlePaymentReceiveCreated(payload: any) {
    if (payload.paymentReceiveDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'PaymentReceive',
        payload.paymentReceiveId,
        payload.paymentReceiveDTO.customFields,
        payload.trx,
      );
    }
  }

  @OnEvent(events.paymentReceive.onEdited)
  async handlePaymentReceiveEdited(payload: any) {
    if (payload.paymentReceiveDTO?.customFields) {
      await this.saveCustomFieldValuesService.saveValues(
        'PaymentReceive',
        payload.paymentReceiveId,
        payload.paymentReceiveDTO.customFields,
        payload.trx,
      );
    }
  }
}
