import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { IBankTransactionUnmatchingEventPayload } from '../types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { MatchedBankTransaction } from '../models/MatchedBankTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PaymentReceived } from '@/modules/PaymentReceived/models/PaymentReceived';
import { BillPayment } from '@/modules/BillPayments/models/BillPayment';
import { DeletePaymentReceivedService } from '@/modules/PaymentReceived/commands/DeletePaymentReceived.service';
import { DeleteBillPayment } from '@/modules/BillPayments/commands/DeleteBillPayment.service';

@Injectable()
export class UnmatchMatchedBankTransaction {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(MatchedBankTransaction.name)
    private readonly matchedBankTransactionModel: TenantModelProxy<
      typeof MatchedBankTransaction
    >,

    private readonly deletePaymentReceivedService: DeletePaymentReceivedService,
    private readonly deleteBillPaymentService: DeleteBillPayment,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,
  ) {}

  /**
   * Unmatch the matched the given uncategorized bank transaction.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   * @returns {Promise<void>}
   */
  public unmatchMatchedTransaction(
    uncategorizedTransactionId: number,
  ): Promise<void> {
    return this.uow.withTransaction(async (trx) => {
      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatching, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);

      const matchedTransactions = await this.matchedBankTransactionModel()
        .query(trx)
        .where('uncategorizedTransactionId', uncategorizedTransactionId);

      // Removes the links before deleting the payments, so the matched
      // transaction delete guards do not reject them.
      await this.matchedBankTransactionModel()
        .query(trx)
        .where('uncategorizedTransactionId', uncategorizedTransactionId)
        .delete();

      // Deletes the payments that matching an invoice or a bill created.
      for (const matchedTransaction of matchedTransactions) {
        await this.deleteMatchCreatedPayment(matchedTransaction, trx);
      }

      await this.eventPublisher.emitAsync(events.bankMatch.onUnmatched, {
        uncategorizedTransactionId,
        trx,
      } as IBankTransactionUnmatchingEventPayload);
    });
  }

  /**
   * Deletes the payment received or bill payment that matching a sale invoice
   * or a bill created, which reverts its GL entries and the document paid amount.
   * The payment is kept while other bank transactions are still linked to it.
   * @param {MatchedBankTransaction} matchedTransaction - Removed matched link.
   * @param {Knex.Transaction} trx - Database transaction.
   * @returns {Promise<void>}
   */
  private async deleteMatchCreatedPayment(
    matchedTransaction: MatchedBankTransaction,
    trx: Knex.Transaction,
  ): Promise<void> {
    const { referenceType, referenceId } = matchedTransaction;

    if (referenceType !== 'PaymentReceive' && referenceType !== 'BillPayment') {
      return;
    }
    const otherMatchedLink = await this.matchedBankTransactionModel()
      .query(trx)
      .findOne({ referenceType, referenceId });

    if (otherMatchedLink) {
      return;
    }
    if (referenceType === 'PaymentReceive') {
      const paymentReceived = await this.paymentReceivedModel()
        .query(trx)
        .findById(referenceId);

      if (paymentReceived) {
        await this.deletePaymentReceivedService.deletePaymentReceive(
          referenceId,
          trx,
        );
      }
    } else {
      const billPayment = await this.billPaymentModel()
        .query(trx)
        .findById(referenceId);

      if (billPayment) {
        await this.deleteBillPaymentService.deleteBillPayment(referenceId, trx);
      }
    }
  }
}
