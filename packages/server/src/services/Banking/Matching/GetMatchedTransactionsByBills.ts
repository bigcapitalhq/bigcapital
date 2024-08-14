import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { Knex } from 'knex';
import { first } from 'lodash';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionBillsTransformer } from './GetMatchedTransactionBillsTransformer';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
} from './types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { CreateBillPayment } from '@/services/Purchases/BillPayments/CreateBillPayment';
import { IBillPaymentDTO } from '@/interfaces';

@Service()
export class GetMatchedTransactionsByBills extends GetMatchedTransactionsByType {
  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private createPaymentMadeService: CreateBillPayment;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Bill, MatchedBankTransaction } = this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the models metadata.
    await initialize(knex, [Bill, MatchedBankTransaction]);

    // Retrieves the bill matches.
    const bills = await Bill.query().onBuild((q) => {
      q.withGraphJoined('matchedBankTransaction');
      q.whereNull('matchedBankTransaction.id');
      q.modify('published');

      if (filter.fromDate) {
        q.where('billDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        q.where('billDate', '<=', filter.toDate);
      }
      q.orderBy('billDate', 'DESC');
    });

    return this.transformer.transform(
      tenantId,
      bills,
      new GetMatchedTransactionBillsTransformer()
    );
  }

  /**
   * Retrieves the given bill matched transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { Bill } = this.tenancy.models(tenantId);

    const bill = await Bill.query().findById(transactionId).throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      bill,
      new GetMatchedTransactionBillsTransformer()
    );
  }

  /**
   * Creates the common matched transaction.
   * @param {number} tenantId
   * @param {Array<number>} uncategorizedTransactionIds
   * @param {IMatchTransactionDTO} matchTransactionDTO
   * @param {Knex.Transaction} trx
   */
  public async createMatchedTransaction(
    tenantId: number,
    uncategorizedTransactionIds: Array<number>,
    matchTransactionDTO: IMatchTransactionDTO,
    trx?: Knex.Transaction
  ): Promise<void> {
    await super.createMatchedTransaction(
      tenantId,
      uncategorizedTransactionIds,
      matchTransactionDTO,
      trx
    );
    const { Bill, UncategorizedCashflowTransaction, MatchedBankTransaction } =
      this.tenancy.models(tenantId);

    const uncategorizedTransactionId = first(uncategorizedTransactionIds);
    const uncategorizedTransaction =
      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    const bill = await Bill.query(trx)
      .findById(matchTransactionDTO.referenceId)
      .throwIfNotFound();

    const createPaymentMadeDTO: IBillPaymentDTO = {
      vendorId: bill.vendorId,
      paymentAccountId: uncategorizedTransaction.accountId,
      paymentDate: uncategorizedTransaction.date,
      exchangeRate: 1,
      entries: [
        {
          paymentAmount: bill.dueAmount,
          billId: bill.id,
        },
      ],
      branchId: bill.branchId,
    };
    // Create a new bill payment associated to the matched bill.
    const billPayment = await this.createPaymentMadeService.createBillPayment(
      tenantId,
      createPaymentMadeDTO,
      trx
    );
    // Link the create bill payment with matched transaction.
    await super.createMatchedTransaction(tenantId, uncategorizedTransactionIds, {
      referenceType: 'BillPayment',
      referenceId: billPayment.id,
    }, trx);
  }
}
