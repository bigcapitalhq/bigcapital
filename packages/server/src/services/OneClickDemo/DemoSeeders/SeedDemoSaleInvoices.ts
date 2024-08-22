import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoSaleInvoices extends SeedDemoAbstract {
  get mapping() {
    return [
      { from: 'Invoice Date', to: 'invoiceDate' },
      { from: 'Due Date', to: 'dueDate' },
      { from: 'Reference No.', to: 'referenceNo' },
      { from: 'Invoice No.', to: 'invoiceNo' },
      { from: 'Customer', to: 'customerId' },
      { from: 'Exchange Rate', to: 'exchangeRate' },
      { from: 'Invoice Message', to: 'invoiceMessage' },
      { from: 'Terms & Conditions', to: 'termsConditions' },
      { from: 'Delivered', to: 'delivered' },
      { from: 'Item', to: 'itemId', group: 'entries' },
      { from: 'Rate', to: 'rate', group: 'entries' },
      { from: 'Quantity', to: 'quantity', group: 'entries' },
      { from: 'Description', to: 'description', group: 'entries' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `sale-invoices.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'SaleInvoice';
  }
}
