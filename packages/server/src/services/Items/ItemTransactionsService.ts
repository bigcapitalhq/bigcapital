import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ItemInvoicesTransactionsTransformer } from './ItemInvoicesTransactionsTransformer';
import { ItemEstimateTransactionTransformer } from './ItemEstimatesTransactionTransformer';
import { ItemBillTransactionTransformer } from './ItemBillsTransactionsTransformer';
import { ItemReceiptTransactionTransformer } from './ItemReceiptsTransactionsTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class ItemTransactionsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the item associated invoices transactions.
   * @param {number} tenantId -
   * @param {number} itemId -
   */
  public async getItemInvoicesTransactions(tenantId: number, itemId: number) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const invoiceEntries = await ItemEntry.query()
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
      tenantId,
      invoiceEntries,
      new ItemInvoicesTransactionsTransformer()
    );
  }

  /**
   * Retrieve the item associated invoices transactions.
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public async getItemBillTransactions(tenantId: number, itemId: number) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const billEntries = await ItemEntry.query()
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
      tenantId,
      billEntries,
      new ItemBillTransactionTransformer()
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public async getItemEstimateTransactions(tenantId: number, itemId: number) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const estimatesEntries = await ItemEntry.query()
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
      tenantId,
      estimatesEntries,
      new ItemEstimateTransactionTransformer()
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public async getItemReceiptTransactions(tenantId: number, itemId: number) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const receiptsEntries = await ItemEntry.query()
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
      tenantId,
      receiptsEntries,
      new ItemReceiptTransactionTransformer()
    );
  }
}
