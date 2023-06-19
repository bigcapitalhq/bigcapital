import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';

@Service()
export default class DeleteCustomerLinkedCreditNote {
  @Inject()
  tenancy: TenancyService;

  /**
   * Validate the given customer has no linked credit note transactions.
   * @param {number} tenantId
   * @param {number} creditNoteId
   */
  public validateCustomerHasNoCreditTransaction = async (
    tenantId: number,
    customerId: number
  ) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    const associatedCredits = await CreditNote.query().where(
      'customerId',
      customerId
    );
    if (associatedCredits.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_LINKED_CREDIT_NOTES);
    }
  };
}
