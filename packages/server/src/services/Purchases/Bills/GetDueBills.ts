import { IBill } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class GetDueBills {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve all due bills or for specific given vendor id.
   * @param {number} tenantId -
   * @param {number} vendorId -
   */
  public async getDueBills(tenantId: number, vendorId?: number): Promise<IBill[]> {
    const { Bill } = this.tenancy.models(tenantId);

    const dueBills = await Bill.query().onBuild((query) => {
      query.orderBy('bill_date', 'DESC');
      query.modify('dueBills');

      if (vendorId) {
        query.where('vendor_id', vendorId);
      }
    });
    return dueBills;
  }
}
