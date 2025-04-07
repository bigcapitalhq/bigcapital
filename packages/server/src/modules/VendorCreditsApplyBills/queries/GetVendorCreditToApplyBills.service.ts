import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditToApplyBillTransformer } from './VendorCreditToApplyBillTransformer';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { Bill } from '@/modules/Bills/models/Bill';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetVendorCreditToApplyBills {
  /**
   * @param {TransformerService} transformerService - The transformer service.
   * @param {typeof Bill} billModel - The bill model.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   */
  constructor(
    private readonly transformerService: TransformerInjectable,
    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Retrieve bills that valid apply to the given vendor credit.
   * @param {number} vendorCreditId
   * @returns {Promise<any[]>}
   */
  public async getCreditToApplyBills(vendorCreditId: number) {
    // Retrieve vendor credit or throw not found service error.
    const vendorCredit = await this.vendorCreditModel()
      .query()
      .findById(vendorCreditId)
      .throwIfNotFound();

    // Retrieve open bills associated to the given vendor.
    const openBills = await this.billModel()
      .query()
      .where('vendor_id', vendorCredit.vendorId)
      .modify('dueBills')
      .modify('published');

    // Transform the bills to POJO.
    return this.transformerService.transform(
      openBills,
      new VendorCreditToApplyBillTransformer(),
    );
  }
}
