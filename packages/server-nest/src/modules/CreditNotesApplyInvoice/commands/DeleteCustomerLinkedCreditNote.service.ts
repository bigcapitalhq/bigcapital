import { Inject, Injectable } from '@nestjs/common';
import { CreditNote } from '../../CreditNotes/models/CreditNote';
import { ERRORS } from '../../CreditNotes/constants';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteCustomerLinkedCreditNoteService {
  /**
   * @param {typeof CreditNote} creditNoteModel - Credit note model.
   */
  constructor(
    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Validate the given customer has no linked credit note transactions.
   * @param {number} customerId - The customer identifier.
   */
  public async validateCustomerHasNoCreditTransaction(customerId: number) {
    const associatedCredits = await this.creditNoteModel()
      .query()
      .where('customerId', customerId);

    if (associatedCredits.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_LINKED_CREDIT_NOTES);
    }
  }
}
