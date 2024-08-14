import { Inject, Service } from 'typedi';
import { initialize } from 'objection';
import { Knex } from 'knex';
import { first } from 'lodash';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from './types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { CreatePaymentReceived } from '@/services/Sales/PaymentReceived/CreatePaymentReceived';
import { IPaymentReceivedCreateDTO } from '@/interfaces';

@Service()
export class GetMatchedTransactionsByInvoices extends GetMatchedTransactionsByType {
  @Inject()
  protected transformer: TransformerInjectable;

  @Inject()
  protected createPaymentReceivedService: CreatePaymentReceived;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    const { SaleInvoice, MatchedBankTransaction } =
      this.tenancy.models(tenantId);
    const knex = this.tenancy.knex(tenantId);

    // Initialize the models metadata.
    await initialize(knex, [SaleInvoice, MatchedBankTransaction]);

    // Retrieve the invoices that not matched, unpaid.
    const invoices = await SaleInvoice.query().onBuild((q) => {
      q.withGraphJoined('matchedBankTransaction');
      q.whereNull('matchedBankTransaction.id');
      q.modify('unpaid');
      q.modify('published');

      if (filter.fromDate) {
        q.where('invoiceDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        q.where('invoiceDate', '<=', filter.toDate);
      }
      q.orderBy('invoiceDate', 'DESC');
    });

    return this.transformer.transform(
      tenantId,
      invoices,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }

  /**
   * Retrieves the matched transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoice = await SaleInvoice.query().findById(transactionId);

    return this.transformer.transform(
      tenantId,
      invoice,
      new GetMatchedTransactionInvoicesTransformer()
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
  ) {
    await super.createMatchedTransaction(
      tenantId,
      uncategorizedTransactionIds,
      matchTransactionDTO,
      trx
    );
    const { SaleInvoice, UncategorizedCashflowTransaction, MatchedBankTransaction } =
      this.tenancy.models(tenantId);

    const uncategorizedTransactionId = first(uncategorizedTransactionIds);
    const uncategorizedTransaction =
      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    const invoice = await SaleInvoice.query(trx)
      .findById(matchTransactionDTO.referenceId)
      .throwIfNotFound();

    const createPaymentReceivedDTO: IPaymentReceivedCreateDTO = {
      customerId: invoice.customerId,
      paymentDate: uncategorizedTransaction.date,
      amount: invoice.dueAmount,
      depositAccountId: uncategorizedTransaction.accountId,
      entries: [
        {
          index: 1,
          invoiceId: invoice.id,
          paymentAmount: invoice.dueAmount,
        },
      ],
      branchId: invoice.branchId,
    };
    // Create a payment received associated to the matched invoice.
    const paymentReceived = await this.createPaymentReceivedService.createPaymentReceived(
      tenantId,
      createPaymentReceivedDTO,
      {},
      trx
    );
    // Link the create payment received with matched invoice transaction.
    await super.createMatchedTransaction(tenantId, uncategorizedTransactionIds, {
      referenceType: 'PaymentReceive',
      referenceId: paymentReceived.id,
    }, trx)
  }
}
