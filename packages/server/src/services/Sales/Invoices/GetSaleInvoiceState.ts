import { Service } from 'typedi';
import { ISaleInvocieState } from '@/interfaces';

@Service()
export class GetSaleInvoiceState {
  /**
   *
   * @param {Number} saleInvoiceId -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoiceState(
    tenantId: number
  ): Promise<ISaleInvocieState> {
    return {
      defaultTemplateId: 1,
    };
  }
}
