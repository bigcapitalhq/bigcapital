import { isEmpty } from 'lodash';
import * as R from 'ramda';
import {
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryData,
} from './CustomerBalanceSummary.types';
import { ContactBalanceSummaryReport } from '../ContactBalanceSummary/ContactBalanceSummary';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { ModelObject } from 'objection';
import { INumberFormatQuery } from '../../types/Report.types';
import { Customer } from '@/modules/Customers/models/Customer';

export class CustomerBalanceSummaryReport extends ContactBalanceSummaryReport {
  readonly ledger: ILedger;
  readonly baseCurrency: string;
  readonly customers: ModelObject<Customer>[];
  readonly filter: ICustomerBalanceSummaryQuery;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {IJournalPoster} receivableLedger
   * @param {ICustomer[]} customers
   * @param {ICustomerBalanceSummaryQuery} filter
   * @param {string} baseCurrency
   */
  constructor(
    ledger: ILedger,
    customers: ModelObject<Customer>[],
    filter: ICustomerBalanceSummaryQuery,
    baseCurrency: string
  ) {
    super();

    this.ledger = ledger;
    this.baseCurrency = baseCurrency;
    this.customers = customers;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Customer section mapper.
   * @param {ModelObject<Customer>} customer
   * @returns {ICustomerBalanceSummaryCustomer}
   */
  private customerMapper = (
    customer: ModelObject<Customer>
  ): ICustomerBalanceSummaryCustomer => {
    const closingBalance = this.ledger
      .whereContactId(customer.id)
      .getClosingBalance();

    return {
      id: customer.id,
      customerName: customer.displayName,
      total: this.getContactTotalFormat(closingBalance),
    };
  };

  /**
   * Mappes the customer model object to customer balance summary section.
   * @param {ModelObject<Customer>[]} customers - Customers.
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  private customersMapper = (
    customers: ModelObject<Customer>[]
  ): ICustomerBalanceSummaryCustomer[] => {
    return customers.map(this.customerMapper);
  };

  /**
   * Detarmines whether the customers post filter is active.
   * @returns {boolean}
   */
  private isCustomersPostFilter = () => {
    return isEmpty(this.filter.customersIds);
  };

  /**
   * Retrieve the customers sections of the report.
   * @param {ModelObject<Customer>[]} customers
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  private getCustomersSection = (
    customers: ModelObject<Customer>[]
  ): ICustomerBalanceSummaryCustomer[] => {
    // @ts-ignore
    return R.compose(
      R.when(this.isCustomersPostFilter, this.contactsFilter),
      R.when(
        R.always(this.filter.percentageColumn),
        this.contactCamparsionPercentageOfColumn
      ),
      this.customersMapper
    )(customers);
  };

  /**
   * Retrieve the report statement data.
   * @returns {ICustomerBalanceSummaryData}
   */
  public reportData = (): ICustomerBalanceSummaryData => {
    const customersSections = this.getCustomersSection(this.customers);
    const customersTotal = this.getContactsTotalSection(customersSections);

    return {
      customers: customersSections,
      total: customersTotal,
    };
  };
}
