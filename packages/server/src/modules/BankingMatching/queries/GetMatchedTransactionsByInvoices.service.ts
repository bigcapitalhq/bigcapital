import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { first, keyBy, uniq } from 'lodash';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from '../types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { CreatePaymentReceivedService } from '@/modules/PaymentReceived/commands/CreatePaymentReceived.serivce';
import { Customer } from '@/modules/Customers/models/Customer';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { IPaymentReceivedCreateDTO } from '@/modules/PaymentReceived/types/PaymentReceived.types';
import { computeNetOfWithholding } from '@/modules/PaymentReceived/withholding.utils';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetMatchedTransactionsByInvoices extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly createPaymentReceivedService: CreatePaymentReceivedService,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {
    super();
  }

  /**
   * Retrieves the matched transactions.
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    filter: GetMatchedTransactionsFilter,
  ): Promise<MatchedTransactionsPOJO> {
    // Retrieve the invoices that not matched, unpaid.
    const invoices = await this.saleInvoiceModel()
      .query()
      .onBuild((q) => {
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
    // Attach customers separately (the withholding tax rate nets the
    // matchable amount) - graph algorithms cannot be mixed on the query.
    const customerIds = uniq(invoices.map((invoice) => invoice.customerId));
    const customers = await this.customerModel()
      .query()
      .whereIn('id', customerIds);
    const customersById = keyBy(customers, 'id');

    invoices.forEach((invoice) => {
      invoice.customer = customersById[invoice.customerId];
    });
    return this.transformer.transform(
      invoices,
      new GetMatchedTransactionInvoicesTransformer(),
    );
  }

  /**
   * Retrieves the matched transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    transactionId: number,
  ): Promise<MatchedTransactionPOJO> {
    const invoice = await this.saleInvoiceModel()
      .query()
      .findById(transactionId)
      .withGraphFetched('customer');

    return this.transformer.transform(
      invoice,
      new GetMatchedTransactionInvoicesTransformer(),
    );
  }

  /**
   * Creates the common matched transaction.
   * @param {Array<number>} uncategorizedTransactionIds
   * @param {IMatchTransactionDTO} matchTransactionDTO
   * @param {Knex.Transaction} trx
   */
  public async createMatchedTransaction(
    uncategorizedTransactionIds: Array<number>,
    matchTransactionDTO: IMatchTransactionDTO,
    trx?: Knex.Transaction,
  ) {
    await super.createMatchedTransaction(
      uncategorizedTransactionIds,
      matchTransactionDTO,
      trx,
    );
    const uncategorizedTransactionId = first(uncategorizedTransactionIds);
    const uncategorizedTransaction =
      await this.uncategorizedBankTransactionModel()
        .query(trx)
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    const invoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(matchTransactionDTO.referenceId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    // The bank deposit arrives net of the customer's withholding tax; the
    // withheld remainder is booked automatically on payment creation.
    const paymentAmount = computeNetOfWithholding(
      invoice.dueAmount,
      invoice.subtotalExludingTax,
      Number(invoice.customer?.withholdingTaxRate) || 0,
    );
    const createPaymentReceivedDTO: IPaymentReceivedCreateDTO = {
      customerId: invoice.customerId,
      paymentDate: uncategorizedTransaction.date,
      amount: paymentAmount,
      depositAccountId: uncategorizedTransaction.accountId,
      entries: [
        {
          index: 1,
          invoiceId: invoice.id,
          paymentAmount,
        },
      ],
      branchId: invoice.branchId,
    };
    // Create a payment received associated to the matched invoice.
    const paymentReceived =
      await this.createPaymentReceivedService.createPaymentReceived(
        createPaymentReceivedDTO,
        trx,
      );
    // Link the create payment received with matched invoice transaction.
    await super.createMatchedTransaction(
      uncategorizedTransactionIds,
      {
        referenceType: 'PaymentReceive',
        referenceId: paymentReceived.id,
      },
      trx,
    );
  }
}
