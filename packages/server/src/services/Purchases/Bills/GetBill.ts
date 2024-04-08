import { IBill } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { BillsValidators } from './BillsValidators';
import { PurchaseInvoiceTransformer } from './PurchaseInvoiceTransformer';

@Service()
export class GetBill {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private validators: BillsValidators;

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
      .withGraphFetched('branch')
      .withGraphFetched('taxes.taxRate');

    // Validates the bill existance.
    this.validators.validateBillExistance(bill);

    return this.transformer.transform(tenantId, bill, new PurchaseInvoiceTransformer());
  }
}
