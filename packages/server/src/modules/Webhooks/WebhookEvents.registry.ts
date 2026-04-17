import { events } from '@/common/events/events';
import { WebhookEventMapping } from './Webhooks.types';

export const WEBHOOK_EVENT_MAPPINGS: WebhookEventMapping[] = [
  // Sale Invoices
  { internalEvent: events.saleInvoice.onCreated, entity: 'sale_invoice', action: 'created', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onEdited, entity: 'sale_invoice', action: 'edited', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onDeleted, entity: 'sale_invoice', action: 'deleted', dataKey: 'oldSaleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onDelivered, entity: 'sale_invoice', action: 'delivered', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onPublished, entity: 'sale_invoice', action: 'published', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onWrittenoff, entity: 'sale_invoice', action: 'writtenoff', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },
  { internalEvent: events.saleInvoice.onWrittenoffCanceled, entity: 'sale_invoice', action: 'writtenoff_canceled', dataKey: 'saleInvoice', idKey: 'saleInvoiceId' },

  // Sale Estimates
  { internalEvent: events.saleEstimate.onCreated, entity: 'sale_estimate', action: 'created', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onEdited, entity: 'sale_estimate', action: 'edited', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onDeleted, entity: 'sale_estimate', action: 'deleted', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onPublished, entity: 'sale_estimate', action: 'published', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onApproved, entity: 'sale_estimate', action: 'approved', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onRejected, entity: 'sale_estimate', action: 'rejected', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },
  { internalEvent: events.saleEstimate.onConvertedToInvoice, entity: 'sale_estimate', action: 'converted_to_invoice', dataKey: 'saleEstimate', idKey: 'saleEstimateId' },

  // Sale Receipts
  { internalEvent: events.saleReceipt.onCreated, entity: 'sale_receipt', action: 'created', dataKey: 'saleReceipt', idKey: 'saleReceiptId' },
  { internalEvent: events.saleReceipt.onEdited, entity: 'sale_receipt', action: 'edited', dataKey: 'saleReceipt', idKey: 'saleReceiptId' },
  { internalEvent: events.saleReceipt.onDeleted, entity: 'sale_receipt', action: 'deleted', dataKey: 'saleReceipt', idKey: 'saleReceiptId' },
  { internalEvent: events.saleReceipt.onPublished, entity: 'sale_receipt', action: 'published', dataKey: 'saleReceipt', idKey: 'saleReceiptId' },
  { internalEvent: events.saleReceipt.onClosed, entity: 'sale_receipt', action: 'closed', dataKey: 'saleReceipt', idKey: 'saleReceiptId' },

  // Payment Receive
  { internalEvent: events.paymentReceive.onCreated, entity: 'payment_receive', action: 'created', dataKey: 'paymentReceive', idKey: 'paymentReceiveId' },
  { internalEvent: events.paymentReceive.onEdited, entity: 'payment_receive', action: 'edited', dataKey: 'paymentReceive', idKey: 'paymentReceiveId' },
  { internalEvent: events.paymentReceive.onDeleted, entity: 'payment_receive', action: 'deleted', dataKey: 'paymentReceive', idKey: 'paymentReceiveId' },
  { internalEvent: events.paymentReceive.onPublished, entity: 'payment_receive', action: 'published', dataKey: 'paymentReceive', idKey: 'paymentReceiveId' },

  // Credit Notes
  { internalEvent: events.creditNote.onCreated, entity: 'credit_note', action: 'created', dataKey: 'creditNote', idKey: 'creditNoteId' },
  { internalEvent: events.creditNote.onEdited, entity: 'credit_note', action: 'edited', dataKey: 'creditNote', idKey: 'creditNoteId' },
  { internalEvent: events.creditNote.onDeleted, entity: 'credit_note', action: 'deleted', dataKey: 'creditNote', idKey: 'creditNoteId' },
  { internalEvent: events.creditNote.onOpened, entity: 'credit_note', action: 'opened', dataKey: 'creditNote', idKey: 'creditNoteId' },
  { internalEvent: events.creditNote.onRefundCreated, entity: 'credit_note', action: 'refund_created', dataKey: 'refundCreditNote', idKey: 'refundCreditNoteId' },
  { internalEvent: events.creditNote.onRefundDeleted, entity: 'credit_note', action: 'refund_deleted', dataKey: 'refundCreditNote', idKey: 'refundCreditNoteId' },
  { internalEvent: events.creditNote.onApplyToInvoicesCreated, entity: 'credit_note', action: 'apply_to_invoices_created', dataKey: 'creditNoteApplyInvoice', idKey: 'creditNoteApplyInvoiceId' },
  { internalEvent: events.creditNote.onApplyToInvoicesDeleted, entity: 'credit_note', action: 'apply_to_invoices_deleted', dataKey: 'creditNoteApplyInvoice', idKey: 'creditNoteApplyInvoiceId' },

  // Bills
  { internalEvent: events.bill.onCreated, entity: 'bill', action: 'created', dataKey: 'bill', idKey: 'billId' },
  { internalEvent: events.bill.onEdited, entity: 'bill', action: 'edited', dataKey: 'bill', idKey: 'billId' },
  { internalEvent: events.bill.onDeleted, entity: 'bill', action: 'deleted', dataKey: 'oldBill', idKey: 'billId' },
  { internalEvent: events.bill.onPublished, entity: 'bill', action: 'published', dataKey: 'bill', idKey: 'billId' },
  { internalEvent: events.bill.onOpened, entity: 'bill', action: 'opened', dataKey: 'bill', idKey: 'billId' },

  // Bill Payments
  { internalEvent: events.billPayment.onCreated, entity: 'bill_payment', action: 'created', dataKey: 'billPayment', idKey: 'billPaymentId' },
  { internalEvent: events.billPayment.onEdited, entity: 'bill_payment', action: 'edited', dataKey: 'billPayment', idKey: 'billPaymentId' },
  { internalEvent: events.billPayment.onDeleted, entity: 'bill_payment', action: 'deleted', dataKey: 'billPayment', idKey: 'billPaymentId' },
  { internalEvent: events.billPayment.onPublished, entity: 'bill_payment', action: 'published', dataKey: 'billPayment', idKey: 'billPaymentId' },

  // Vendor Credits
  { internalEvent: events.vendorCredit.onCreated, entity: 'vendor_credit', action: 'created', dataKey: 'vendorCredit', idKey: 'vendorCreditId' },
  { internalEvent: events.vendorCredit.onEdited, entity: 'vendor_credit', action: 'edited', dataKey: 'vendorCredit', idKey: 'vendorCreditId' },
  { internalEvent: events.vendorCredit.onDeleted, entity: 'vendor_credit', action: 'deleted', dataKey: 'vendorCredit', idKey: 'vendorCreditId' },
  { internalEvent: events.vendorCredit.onOpened, entity: 'vendor_credit', action: 'opened', dataKey: 'vendorCredit', idKey: 'vendorCreditId' },
  { internalEvent: events.vendorCredit.onRefundCreated, entity: 'vendor_credit', action: 'refund_created', dataKey: 'refundVendorCredit', idKey: 'refundVendorCreditId' },
  { internalEvent: events.vendorCredit.onRefundDeleted, entity: 'vendor_credit', action: 'refund_deleted', dataKey: 'refundVendorCredit', idKey: 'refundVendorCreditId' },
  { internalEvent: events.vendorCredit.onApplyToInvoicesCreated, entity: 'vendor_credit', action: 'apply_to_bills_created', dataKey: 'vendorCreditApplyBill', idKey: 'vendorCreditApplyBillId' },
  { internalEvent: events.vendorCredit.onApplyToInvoicesDeleted, entity: 'vendor_credit', action: 'apply_to_bills_deleted', dataKey: 'vendorCreditApplyBill', idKey: 'vendorCreditApplyBillId' },

  // Customers
  { internalEvent: events.customers.onCreated, entity: 'customer', action: 'created', dataKey: 'customer', idKey: 'customerId' },
  { internalEvent: events.customers.onEdited, entity: 'customer', action: 'edited', dataKey: 'customer', idKey: 'customerId' },
  { internalEvent: events.customers.onDeleted, entity: 'customer', action: 'deleted', dataKey: 'customer', idKey: 'customerId' },
  { internalEvent: events.customers.onActivated, entity: 'customer', action: 'activated', dataKey: 'customer', idKey: 'customerId' },
  { internalEvent: events.customers.onOpeningBalanceChanged, entity: 'customer', action: 'opening_balance_changed', dataKey: 'customer', idKey: 'customerId' },

  // Vendors
  { internalEvent: events.vendors.onCreated, entity: 'vendor', action: 'created', dataKey: 'vendor', idKey: 'vendorId' },
  { internalEvent: events.vendors.onEdited, entity: 'vendor', action: 'edited', dataKey: 'vendor', idKey: 'vendorId' },
  { internalEvent: events.vendors.onDeleted, entity: 'vendor', action: 'deleted', dataKey: 'vendor', idKey: 'vendorId' },
  { internalEvent: events.vendors.onActivated, entity: 'vendor', action: 'activated', dataKey: 'vendor', idKey: 'vendorId' },
  { internalEvent: events.vendors.onOpeningBalanceChanged, entity: 'vendor', action: 'opening_balance_changed', dataKey: 'vendor', idKey: 'vendorId' },

  // Items
  { internalEvent: events.item.onCreated, entity: 'item', action: 'created', dataKey: 'item', idKey: 'itemId' },
  { internalEvent: events.item.onEdited, entity: 'item', action: 'edited', dataKey: 'item', idKey: 'itemId' },
  { internalEvent: events.item.onDeleted, entity: 'item', action: 'deleted', dataKey: 'item', idKey: 'itemId' },
  { internalEvent: events.item.onActivated, entity: 'item', action: 'activated', dataKey: 'item', idKey: 'itemId' },
  { internalEvent: events.item.onInactivated, entity: 'item', action: 'inactivated', dataKey: 'item', idKey: 'itemId' },

  // Item Categories
  { internalEvent: events.itemCategory.onCreated, entity: 'item_category', action: 'created', dataKey: 'itemCategory', idKey: 'itemCategoryId' },
  { internalEvent: events.itemCategory.onEdited, entity: 'item_category', action: 'edited', dataKey: 'itemCategory', idKey: 'itemCategoryId' },
  { internalEvent: events.itemCategory.onDeleted, entity: 'item_category', action: 'deleted', dataKey: 'itemCategory', idKey: 'itemCategoryId' },

  // Inventory Adjustments
  { internalEvent: events.inventoryAdjustment.onCreated, entity: 'inventory_adjustment', action: 'created', dataKey: 'inventoryAdjustment', idKey: 'inventoryAdjustmentId' },
  { internalEvent: events.inventoryAdjustment.onDeleted, entity: 'inventory_adjustment', action: 'deleted', dataKey: 'inventoryAdjustment', idKey: 'inventoryAdjustmentId' },
  { internalEvent: events.inventoryAdjustment.onPublished, entity: 'inventory_adjustment', action: 'published', dataKey: 'inventoryAdjustment', idKey: 'inventoryAdjustmentId' },

  // Warehouse Transfers
  { internalEvent: events.warehouseTransfer.onCreated, entity: 'warehouse_transfer', action: 'created', dataKey: 'warehouseTransfer', idKey: 'warehouseTransferId' },
  { internalEvent: events.warehouseTransfer.onEdited, entity: 'warehouse_transfer', action: 'edited', dataKey: 'warehouseTransfer', idKey: 'warehouseTransferId' },
  { internalEvent: events.warehouseTransfer.onDeleted, entity: 'warehouse_transfer', action: 'deleted', dataKey: 'warehouseTransfer', idKey: 'warehouseTransferId' },
  { internalEvent: events.warehouseTransfer.onInitiated, entity: 'warehouse_transfer', action: 'initiated', dataKey: 'warehouseTransfer', idKey: 'warehouseTransferId' },
  { internalEvent: events.warehouseTransfer.onTransferred, entity: 'warehouse_transfer', action: 'transferred', dataKey: 'warehouseTransfer', idKey: 'warehouseTransferId' },
];
