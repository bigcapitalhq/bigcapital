import { Service } from 'typedi';
import { ISaleReceiptState } from '@/interfaces';

@Service()
export class GetSaleReceiptState {
  /**
   * Retireves the sale receipt state.
   * @param {Number} tenantId -
   * @return {Promise<ISaleReceiptState>}
   */
  public async getSaleReceiptState(
    tenantId: number
  ): Promise<ISaleReceiptState> {
    return {
      defaultTemplateId: 1,
    };
  }
}
