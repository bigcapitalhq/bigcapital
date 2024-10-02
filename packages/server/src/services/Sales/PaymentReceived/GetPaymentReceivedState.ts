import { Service } from 'typedi';
import { IPaymentReceivedState } from '@/interfaces';

@Service()
export class GetPaymentReceivedState {
  /**
   * Retrieves the current state of the payment received.
   * @param {number} tenantId - The ID of the tenant.
   * @returns {Promise<IPaymentReceivedState>} - A promise resolving to the payment received state.
   */
  public async getPaymentReceivedState(
    tenantId: number
  ): Promise<IPaymentReceivedState> {
    return {
      defaultTemplateId: 1,
    };
  }
}
