import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { Service, Inject } from 'typedi';
import BaseVendorCredit from '../BaseVendorCredit';
import { VendorCreditToApplyBillTransformer } from './VendorCreditToApplyBillTransformer';

@Service()
export default class GetVendorCreditToApplyBills extends BaseVendorCredit {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve bills that valid apply to the given vendor credit.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @returns
   */
  public getCreditToApplyBills = async (
    tenantId: number,
    vendorCreditId: number
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    // Retrieve vendor credit or throw not found service error.
    const vendorCredit = await this.getVendorCreditOrThrowError(
      tenantId,
      vendorCreditId
    );
    // Retrieve open bills associated to the given vendor.
    const openBills = await Bill.query()
      .where('vendor_id', vendorCredit.vendorId)
      .modify('dueBills')
      .modify('published');

    // Transforms the bills to POJO.
    return this.transformer.transform(
      tenantId,
      openBills,
      new VendorCreditToApplyBillTransformer()
    );
  };
}
