import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { IBill } from '@/interfaces';
import { PurchaseInvoiceTransformer } from '../PurchaseInvoices/PurchaseInvoiceTransformer';
import { ERRORS } from './constants';

@Service()
export class GetBill {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given bill details with associated items entries.
   * @param {Integer} billId - Specific bill.
   * @returns {Promise<IBill>}
   */
  public async getBill(tenantId: number, billId: number): Promise<IBill> {
    const { Bill } = this.tenancy.models(tenantId);

    const bill = await Bill.query()
      .findById(billId)
      .withGraphFetched('vendor')
      .withGraphFetched('entries.item')
      .withGraphFetched('branch');

    if (!bill) {
      throw new ServiceError(ERRORS.BILL_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      bill,
      new PurchaseInvoiceTransformer()
    );
  }
}
