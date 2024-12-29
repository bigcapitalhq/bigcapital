import { Inject, Injectable } from '@nestjs/common';
import { CreditNote } from '../models/CreditNote';
import { ERRORS } from '../constants';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class DeleteCustomerLinkedCreditNoteService {
  constructor(
    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Validate the given customer has no linked credit note transactions.
   * @param {number} customerId - The customer identifier.
   */
  public async validateCustomerHasNoCreditTransaction(customerId: number) {
    const associatedCredits = await this.creditNoteModel
      .query()
      .where('customerId', customerId);

    if (associatedCredits.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_LINKED_CREDIT_NOTES);
    }
  }
}
