import { Inject, Injectable } from '@nestjs/common';
import { Bill } from '../models/Bill';

@Injectable()
export class GetDueBills {
  constructor(
    @Inject(Bill.name)
    private billModel: typeof Bill,
  ) {}

  /**
   * Retrieve all due bills or for specific given vendor id.
   * @param {number} vendorId -
   */
  public async getDueBills(vendorId?: number): Promise<Bill[]> {
    const dueBills = await this.billModel.query().onBuild((query) => {
      query.orderBy('bill_date', 'DESC');
      query.modify('dueBills');

      if (vendorId) {
        query.where('vendor_id', vendorId);
      }
    });
    return dueBills;
  }
}
