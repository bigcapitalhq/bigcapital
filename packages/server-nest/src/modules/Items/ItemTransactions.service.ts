import { Inject, Injectable } from '@nestjs/common';
import { ItemInvoicesTransactionsTransformer } from './ItemInvoicesTransactions.transformer';
import { ItemEstimateTransactionTransformer } from './ItemEstimatesTransaction.transformer';
import { ItemBillTransactionTransformer } from './ItemBillsTransactions.transformer';
import { ItemReceiptTransactionTransformer } from './ItemReceiptsTransactions.transformer';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';

@Injectable()
export class ItemTransactionsService {
  constructor(
    private transformer: TransformerInjectable,

    @Inject(ItemEntry.name)
    private readonly itemEntry: typeof ItemEntry,
  ) {}

  /**
   * Retrieves the item associated invoices transactions.
   * @param {number} itemId -
   */
  public async getItemInvoicesTransactions(itemId: number) {
    const invoiceEntries = await this.itemEntry.query()
      .where('itemId', itemId)
      .where('referenceType', 'SaleInvoice')
      .withGraphJoined('invoice.customer(selectCustomerColumns)')
      .orderBy('invoice:invoiceDate', 'ASC')
      .modifiers({
        selectCustomerColumns: (builder) => {
          builder.select('displayName', 'currencyCode', 'id');
        },
      });
    // Retrieves the transformed invoice entries.
    return this.transformer.transform(
      invoiceEntries,
      new ItemInvoicesTransactionsTransformer(),
    );
  }

  /**
   * Retrieve the item associated invoices transactions.
   * @param {number} itemId
   * @returns
   */
  public async getItemBillTransactions(itemId: number) {
    const billEntries = await this.itemEntry.query()
      .where('itemId', itemId)
      .where('referenceType', 'Bill')
      .withGraphJoined('bill.vendor(selectVendorColumns)')
      .orderBy('bill:billDate', 'ASC')
      .modifiers({
        selectVendorColumns: (builder) => {
          builder.select('displayName', 'currencyCode', 'id');
        },
      });
    // Retrieves the transformed bill entries.
    return this.transformer.transform(
      billEntries,
      new ItemBillTransactionTransformer(),
    );
  }

  /**
   * Retrieves the item associated estimates transactions.
   * @param {number} itemId
   * @returns
   */
  public async getItemEstimateTransactions(itemId: number) {
    const estimatesEntries = await this.itemEntry.query()
      .where('itemId', itemId)
      .where('referenceType', 'SaleEstimate')
      .withGraphJoined('estimate.customer(selectCustomerColumns)')
      .orderBy('estimate:estimateDate', 'ASC')
      .modifiers({
        selectCustomerColumns: (builder) => {
          builder.select('displayName', 'currencyCode', 'id');
        },
      });
    // Retrieves the transformed estimates entries.
    return this.transformer.transform(
      estimatesEntries,
      new ItemEstimateTransactionTransformer(),
    );
  }

  /**
   * Retrieves the item associated receipts transactions.
   * @param {number} itemId
   * @returns
   */
  public async getItemReceiptTransactions(itemId: number) {
    const receiptsEntries = await this.itemEntry.query()
      .where('itemId', itemId)
      .where('referenceType', 'SaleReceipt')
      .withGraphJoined('receipt.customer(selectCustomerColumns)')
      .orderBy('receipt:receiptDate', 'ASC')
      .modifiers({
        selectCustomerColumns: (builder) => {
          builder.select('displayName', 'currencyCode', 'id');
        },
      });
    // Retrieves the transformed receipts entries.
    return this.transformer.transform(
      receiptsEntries,
      new ItemReceiptTransactionTransformer(),
    );
  }
}
