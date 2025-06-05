import * as R from 'ramda';
import { isEmpty } from 'lodash';
import { ModelObject } from 'objection';
import { I18nService } from 'nestjs-i18n';
import {
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsTransaction,
  ITransactionsByVendorsVendor,
  ITransactionsByVendorsData,
} from './TransactionsByVendor.types';
import { TransactionsByContact } from '../TransactionsByContact/TransactionsByContact';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { INumberFormatQuery } from '../../types/Report.types';
import { TransactionsByVendorRepository } from './TransactionsByVendorRepository';

const VENDOR_NORMAL = 'credit';

export class TransactionsByVendor extends TransactionsByContact {
  public readonly repository: TransactionsByVendorRepository;
  public readonly filter: ITransactionsByVendorsFilter;
  public readonly numberFormat: INumberFormatQuery;
  public readonly i18n: I18nService;
  
  /**
   * Constructor method.
   * @param {TransactionsByVendorRepository} transactionsByVendorRepository - Transactions by vendor repository.
   * @param {ITransactionsByVendorsFilter} filter - Transactions by vendors filter.
   * @param {I18nService} i18n - Internationalization service.
   */
  constructor(
    transactionsByVendorRepository: TransactionsByVendorRepository,
    filter: ITransactionsByVendorsFilter,
    i18n: I18nService,
  ) {
    super();

    this.repository = transactionsByVendorRepository;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
    this.i18n = i18n;
  }

  /**
   * Retrieve the vendor transactions from the given vendor id and opening balance.
   * @param {number} vendorId - Vendor id.
   * @param {number} openingBalance - Opening balance amount.
   * @returns {ITransactionsByVendorsTransaction[]}
   */
  public vendorTransactions(
    vendorId: number,
    openingBalance: number,
  ): ITransactionsByVendorsTransaction[] {
    const openingBalanceLedger = this.repository.ledger
      .whereContactId(vendorId)
      .whereFromDate(this.filter.fromDate)
      .whereToDate(this.filter.toDate);

    const openingEntries = openingBalanceLedger.getEntries();

    return R.compose(
      R.curry(this.contactTransactionRunningBalance)(openingBalance, 'credit'),
      R.map(this.contactTransactionMapper.bind(this)),
    ).bind(this)(openingEntries);
  }

  /**
   * Vendor section mapper.
   * @param {IVendor} vendor
   * @returns {ITransactionsByVendorsVendor}
   */
  public vendorMapper(
    vendor: ModelObject<Vendor>,
  ): ITransactionsByVendorsVendor {
    const openingBalance = this.getContactOpeningBalance(vendor.id);
    const transactions = this.vendorTransactions(vendor.id, openingBalance);
    const closingBalance = this.getVendorClosingBalance(
      transactions,
      openingBalance,
    );
    const currencyCode = this.baseCurrency;

    return {
      vendorName: vendor.displayName,
      openingBalance: this.getTotalAmountMeta(openingBalance, currencyCode),
      closingBalance: this.getTotalAmountMeta(closingBalance, currencyCode),
      transactions,
    };
  }

  /**
   * Retrieve the vendor closing balance from the given customer transactions.
   * @param {ITransactionsByContactsTransaction[]} customerTransactions
   * @param {number} openingBalance
   * @returns
   */
  public getVendorClosingBalance(
    vendorTransactions: ITransactionsByVendorsTransaction[],
    openingBalance: number,
  ) {
    return this.getContactClosingBalance(
      vendorTransactions,
      VENDOR_NORMAL,
      openingBalance,
    );
  }

  /**
   * Detarmines whether the vendors post filter is active.
   * @returns {boolean}
   */
  public isVendorsPostFilter = (): boolean => {
    return isEmpty(this.filter.vendorsIds);
  };

  /**
   * Retrieve the vendors sections of the report.
   * @param {IVendor[]} vendors
   * @returns {ITransactionsByVendorsVendor[]}
   */
  public vendorsMapper(
    vendors: ModelObject<Vendor>[],
  ): ITransactionsByVendorsVendor[] {
    return R.compose(
      R.when(this.isVendorsPostFilter, this.contactsFilter),
      R.map(this.vendorMapper.bind(this)),
    ).bind(this)(vendors);
  }

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByVendorsData}
   */
  public reportData(): ITransactionsByVendorsData {
    return this.vendorsMapper(this.repository.vendors);
  }
}
