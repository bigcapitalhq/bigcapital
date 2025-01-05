import { Knex } from 'knex';
import { first } from 'lodash';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from '../types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { CreatePaymentReceivedService } from '@/modules/PaymentReceived/commands/CreatePaymentReceived.serivce';
import { Inject, Injectable } from '@nestjs/common';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { IPaymentReceivedCreateDTO } from '@/modules/PaymentReceived/types/PaymentReceived.types';

@Injectable()
export class GetMatchedTransactionsByInvoices extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly createPaymentReceivedService: CreatePaymentReceivedService,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: typeof SaleInvoice,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {
    super();
  }

  /**
   * Retrieves the matched transactions.
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    // Retrieve the invoices that not matched, unpaid.
    const invoices = await this.saleInvoiceModel.query().onBuild((q) => {
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
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const invoice = await this.saleInvoiceModel.query().findById(transactionId);

    return this.transformer.transform(
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
    uncategorizedTransactionIds: Array<number>,
    matchTransactionDTO: IMatchTransactionDTO,
    trx?: Knex.Transaction
  ) {
    await super.createMatchedTransaction(
      uncategorizedTransactionIds,
      matchTransactionDTO,
      trx
    );
    const uncategorizedTransactionId = first(uncategorizedTransactionIds);
    const uncategorizedTransaction =
      await this.uncategorizedBankTransactionModel.query(trx)
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
      createPaymentReceivedDTO,
      trx
    );
    // Link the create payment received with matched invoice transaction.
    await super.createMatchedTransaction(uncategorizedTransactionIds, {
      referenceType: 'PaymentReceive',
      referenceId: paymentReceived.id,
    }, trx)
  }
}
