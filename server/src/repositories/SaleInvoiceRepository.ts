import { SaleInvoice } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class SaleInvoiceRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return SaleInvoice.bindKnex(this.knex);
  }
}