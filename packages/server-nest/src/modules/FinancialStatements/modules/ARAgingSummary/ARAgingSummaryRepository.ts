import { Inject } from '@nestjs/common';
import { isEmpty, groupBy } from 'lodash';
import { Customer } from '@/modules/Customers/models/Customer';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { ModelObject } from 'objection';
import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

export class ARAgingSummaryRepository {
  @Inject(TenancyContext)
  private tenancyContext: TenancyContext;

  @Inject(Customer.name)
  private customerModel: TenantModelProxy<typeof Customer>;

  @Inject(SaleInvoice.name)
  private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>;

  /**
   * Filter.
   * @param {IARAgingSummaryQuery} filter
   */
  filter: IARAgingSummaryQuery;

  /**
   * Base currency.
   * @param {string} baseCurrency
   */
  baseCurrency: string;

  /**
   * Customers.
   * @param {ModelObject<Customer>[]} customers
   */
  customers: ModelObject<Customer>[];

  /**
   * Overdue sale invoices.
   * @param {ModelObject<SaleInvoice>[]} overdueSaleInvoices
   */
  overdueSaleInvoices: ModelObject<SaleInvoice>[];

  /**
   * Current sale invoices.
   * @param {ModelObject<SaleInvoice>[]} currentInvoices
   */
  currentInvoices: ModelObject<SaleInvoice>[];

  /**
   * Current sale invoices by contact id.
   * @param {Record<string, ModelObject<SaleInvoice>[]>} currentInvoicesByContactId
   */
  currentInvoicesByContactId: Record<string, ModelObject<SaleInvoice>[]>;

  /**
   * Overdue sale invoices by contact id.
   * @param {Record<string, ModelObject<SaleInvoice>[]>} overdueInvoicesByContactId
   */
  overdueInvoicesByContactId: Record<string, ModelObject<SaleInvoice>[]>;

  /**
   * Set the filter.
   * @param {IARAgingSummaryQuery} filter
   */
  setFilter(filter: IARAgingSummaryQuery) {
    this.filter = filter;
  }

  /**
   * Initialize the repository.
   */
  async load() {
    await this.initBaseCurrency();
    await this.initCustomers();
    await this.initOverdueSaleInvoices();
    await this.initCurrentInvoices();
  }

  /**
   * Initialize the base currency.
   */
  async initBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Initialize the customers.
   */
  async initCustomers() {
    // Retrieve all customers from the storage.
    const customers =
      this.filter.customersIds.length > 0
        ? await this.customerModel()
            .query()
            .whereIn('id', this.filter.customersIds)
        : await this.customerModel().query();

    this.customers = customers;
  }

  /**
   * Initialize the overdue sale invoices.
   */
  async initOverdueSaleInvoices() {
    const commonQuery = (query) => {
      if (!isEmpty(this.filter.branchesIds)) {
        query.modify('filterByBranches', this.filter.branchesIds);
      }
    };
    // Retrieve all overdue sale invoices.
    const overdueSaleInvoices = await this.saleInvoiceModel()
      .query()
      .modify('overdueInvoicesFromDate', this.filter.asDate)
      .onBuild(commonQuery);

    this.overdueSaleInvoices = overdueSaleInvoices;
    this.overdueInvoicesByContactId = groupBy(
      overdueSaleInvoices,
      'customerId',
    );
  }

  /**
   * Initialize the current sale invoices.
   */
  async initCurrentInvoices() {
    const commonQuery = (query) => {
      if (!isEmpty(this.filter.branchesIds)) {
        query.modify('filterByBranches', this.filter.branchesIds);
      }
    };
    // Retrieve all due sale invoices.
    const currentInvoices = await this.saleInvoiceModel()
      .query()
      .modify('dueInvoicesFromDate', this.filter.asDate)
      .onBuild(commonQuery);

    this.currentInvoices = currentInvoices;
    this.currentInvoicesByContactId = groupBy(
      currentInvoices,
      'customerId',
    );
  }
}
