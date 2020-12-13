import { SaleInvoice } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class SaleInvoiceRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = SaleInvoice;
  }  
}