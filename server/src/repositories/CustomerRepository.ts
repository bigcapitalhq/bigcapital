import TenantRepository from "./TenantRepository";

export default class CustomerRepository extends TenantRepository {
  models: any;
  cache: any;

  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(tenantId: number) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
  }

  /**
   * Retrieve customer details of the given id.
   * @param {number} customerId - Customer id.
   */
  getById(customerId: number) {
    const { Contact } = this.models;

    return this.cache.get(`customers.id.${customerId}`, () => {
      return Contact.query().modifier('customer').findById(customerId);
    });
  }

  /**
   * Detarmines the given customer exists.
   * @param {number} customerId 
   * @returns {boolean}
   */
  isExists(customerId: number) {
    return !!this.getById(customerId);
  }

  /**
   * Retrieve the sales invoices that assocaited to the given customer.
   * @param {number} customerId 
   */
  getSalesInvoices(customerId: number) {
    const { SaleInvoice } = this.models;

    return this.cache.get(`customers.invoices.${customerId}`, () => {
      return SaleInvoice.query().where('customer_id', customerId);
    });
  }

  /**
   * Retrieve customers details of the given ids.
   * @param  {number[]} customersIds - Customers ids.
   * @return {IContact[]}
   */
  customers(customersIds: number[]) {
    const { Contact } = this.models;
    return Contact.query().modifier('customer').whereIn('id', customersIds);
  }
  
  /**
   * Retrieve customers of the given ids with associated sales invoices.
   * @param {number[]} customersIds - Customers ids.
   */
  customersWithSalesInvoices(customersIds: number[]) {
    const { Contact } = this.models;
    return Contact.query().modify('customer')
      .whereIn('id', customersIds)
      .withGraphFetched('salesInvoices');
  }
}