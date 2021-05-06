import * as R from 'ramda';
import { sumBy } from 'lodash';
import {
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsTransaction,
  ITransactionsByVendorsVendor,
  ITransactionsByVendorsAmount,
  ITransactionsByVendorsData,
  IAccountTransaction,
  INumberFormatQuery,
  IVendor
} from 'interfaces';
import TransactionsByContact from "../TransactionsByContact/TransactionsByContact";

export default class TransactionsByVendors extends TransactionsByContact{
  readonly contacts: IVendor[];
  readonly transactionsByContact: any;
  readonly filter: ITransactionsByVendorsFilter;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {IVendor} vendors
   * @param {Map<number, IAccountTransaction[]>} transactionsByContact
   * @param {string} baseCurrency
   */
  constructor(
    vendors: IVendor[],
    transactionsByContact: Map<number, IAccountTransaction[]>,
    filter: ITransactionsByVendorsFilter,
    baseCurrency: string
  ) {
    super();

    this.contacts = vendors;
    this.transactionsByContact = transactionsByContact;
    this.baseCurrency = baseCurrency;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Retrieve the vendor transactions from the given vendor id and opening balance.
   * @param {number} vendorId - Vendor id.
   * @param {number} openingBalance - Opening balance amount.
   * @returns {ITransactionsByVendorsTransaction[]}
   */
  private vendorTransactions(
    vendorId: number,
    openingBalance: number
  ): ITransactionsByVendorsTransaction[] {
    const transactions = this.transactionsByContact.get(vendorId + '') || [];

    return R.compose(
      R.curry(this.contactTransactionRunningBalance)(openingBalance),
      R.map(this.contactTransactionMapper.bind(this))
    ).bind(this)(transactions);
  }

  /**
   * Vendor section mapper.
   * @param {IVendor} vendor
   * @returns {ITransactionsByVendorsVendor}
   */
  private vendorMapper(
    vendor: IVendor
  ): ITransactionsByVendorsVendor {
    const openingBalance = this.getContactOpeningBalance(1);
    const transactions = this.vendorTransactions(vendor.id, openingBalance);
    const closingBalance = this.getContactClosingBalance(transactions, 0);

    return {
      vendorName: vendor.displayName,
      openingBalance: this.getContactAmount(
        openingBalance,
        vendor.currencyCode
      ),
      closingBalance: this.getContactAmount(
        closingBalance,
        vendor.currencyCode
      ),
      transactions,
    };
  }

  /**
   * Retrieve the vendors sections of the report.
   * @param {IVendor[]} vendors
   * @returns {ITransactionsByVendorsVendor[]}
   */
  private vendorsMapper(
    vendors: IVendor[]
  ): ITransactionsByVendorsVendor[] {
    return R.compose(R.map(this.vendorMapper.bind(this))).bind(this)(
      vendors
    );
  }

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByVendorsData}
   */
  public reportData(): ITransactionsByVendorsData {
    return this.vendorsMapper(this.contacts);
  }

  /**
   * Retrieve the report columns.
   */
  public reportColumns() {
    return [];
  }
}