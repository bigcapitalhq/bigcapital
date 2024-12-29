import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../../CreditNotes/constants';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Account } from '@/modules/Accounts/models/Account.model';

@Injectable()
export class RefundCreditNoteService {
  /**
   * @param {typeof RefundCreditNote} refundCreditNoteModel - The refund credit note model.
   */
  constructor(
    @Inject(RefundCreditNote.name)
    private readonly refundCreditNoteModel: typeof RefundCreditNote,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} refundCreditId
   * @returns {Promise<RefundCreditNote>}
   */
  public getCreditNoteRefundOrThrowError = async (
    refundCreditId: number,
  ): Promise<RefundCreditNote> => {
    const refundCreditNote = await this.refundCreditNoteModel
      .query()
      .findById(refundCreditId);
    if (!refundCreditNote) {
      throw new ServiceError(ERRORS.REFUND_CREDIT_NOTE_NOT_FOUND);
    }
    return refundCreditNote;
  };

  /**
   * Validate the refund account type.
   * @param {Account} account
   */
  public validateRefundWithdrawwalAccountType = (account: Account): void => {
    const supportedTypes = ['bank', 'cash', 'fixed-asset'];

    if (supportedTypes.indexOf(account.accountType) === -1) {
      throw new ServiceError(ERRORS.ACCOUNT_INVALID_TYPE);
    }
  };
}
