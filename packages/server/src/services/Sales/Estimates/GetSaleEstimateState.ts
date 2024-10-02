

import { Service } from 'typedi';
import { ISaleEstimateState } from '@/interfaces';

@Service()
export class GetSaleEstimateState {
  /**
   *
   * @param {Number} saleEstimateId -
   * @return {Promise<ISaleEstimateState>}
   */
  public async getSaleEstimateState(
    tenantId: number
  ): Promise<ISaleEstimateState> {
    return {
      defaultTemplateId: 1,
    };
  }
}
