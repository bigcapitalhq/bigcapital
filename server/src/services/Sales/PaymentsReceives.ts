import { omit, sumBy, chain } from 'lodash';
import moment from 'moment';
import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import { IPaymentReceiveOTD } from 'interfaces';
import AccountsService from 'services/Accounts/AccountsService';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import JournalPosterService from 'services/Sales/JournalPosterService';
import ServiceItemsEntries from 'services/Sales/ServiceItemsEntries';
import PaymentReceiveEntryRepository from 'repositories/PaymentReceiveEntryRepository';
import CustomerRepository from 'repositories/CustomerRepository';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { formatDateFields } from 'utils';

/**
 * Payment receive service.
 * @service
 */
@Service()
export default class PaymentReceiveService {
  @Inject()
  accountsService: AccountsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;



  /**
   * Validates the payment receive number existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validatePaymentReceiveNoExistance(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isPaymentNoExists = await this.paymentReceiveService.isPaymentReceiveNoExists(
      tenantId,
      req.body.payment_receive_no,
      req.params.id,
    );
    if (isPaymentNoExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.RECEIVE.NUMBER.EXISTS', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validates the payment receive existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validatePaymentReceiveExistance(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isPaymentNoExists = await this.paymentReceiveService
      .isPaymentReceiveExists(
        tenantId,
        req.params.id
      );
    if (!isPaymentNoExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.RECEIVE.NOT.EXISTS', code: 600 }],
      });
    }
    next();
  }

  /**
   * Validate the deposit account id existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateDepositAccount(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isDepositAccExists = await this.accountsService.isAccountExists(
      tenantId,
      req.body.deposit_account_id
    );
    if (!isDepositAccExists) {
      return res.status(400).send({
        errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validates the `customer_id` existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateCustomerExistance(req: Request, res: Response, next: Function) {
    const  { Customer } = req.models;

    const isCustomerExists = await Customer.query().findById(req.body.customer_id);

    if (!isCustomerExists) {
      return res.status(400).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the invoices IDs existance.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateInvoicesIDs(req: Request, res: Response, next: Function) {
    const paymentReceive = { ...req.body };
    const { tenantId } = req;
    const invoicesIds = paymentReceive.entries
      .map((e) => e.invoice_id);

    const notFoundInvoicesIDs = await this.saleInvoiceService.isInvoicesExist(
      tenantId,
      invoicesIds,
      paymentReceive.customer_id,
    );
    if (notFoundInvoicesIDs.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'INVOICES.IDS.NOT.FOUND', code: 500 }],
      });
    }
    next();
  }

  /**
   * Validates entries invoice payment amount.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateInvoicesPaymentsAmount(req: Request, res: Response, next: Function) {
    const { SaleInvoice } = req.models;
    const invoicesIds = req.body.entries.map((e) => e.invoice_id);

    const storedInvoices = await SaleInvoice.query()
      .whereIn('id', invoicesIds);

    const storedInvoicesMap = new Map(
      storedInvoices.map((invoice) => [invoice.id, invoice])
    );
    const hasWrongPaymentAmount: any[] = [];

    req.body.entries.forEach((entry, index: number) => {
      const entryInvoice = storedInvoicesMap.get(entry.invoice_id);
      const { dueAmount } = entryInvoice;

      if (dueAmount < entry.payment_amount) {
        hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
      }
    });
    if (hasWrongPaymentAmount.length > 0) {
      return res.status(400).send({
        errors: [
          {
            type: 'INVOICE.PAYMENT.AMOUNT',
            code: 200,
            indexes: hasWrongPaymentAmount,
          },
        ],
      });
    }
    next();
  }

  /**
   * Validate the payment receive entries IDs existance. 
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async validateEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const paymentReceive = { id: req.params.id, ...req.body };
    const entriesIds = paymentReceive.entries
      .filter(entry => entry.id)
      .map(entry => entry.id);

    const { PaymentReceiveEntry } = req.models;

    const storedEntries = await PaymentReceiveEntry.query()
      .where('payment_receive_id', paymentReceive.id);

    const storedEntriesIds = storedEntries.map((entry) => entry.id);    
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ENTEIES.IDS.NOT.FOUND', code: 800 }],
      });
    }
    next();
  }


  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {IPaymentReceive} paymentReceive
   */
  public async createPaymentReceive(tenantId: number, paymentReceive: IPaymentReceiveOTD) {
    const {
      PaymentReceive,
      PaymentReceiveEntry,
      SaleInvoice,
      Customer,
    } = this.tenancy.models(tenantId);

    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');

    this.logger.info('[payment_receive] inserting to the storage.');
    const storedPaymentReceive = await PaymentReceive.query()
      .insertGraph({
        amount: paymentAmount,
        ...formatDateFields(omit(paymentReceive, ['entries']), ['payment_date']),
        entries: paymentReceive.entries.map((entry) => ({ ...entry })),
      });
    const storeOpers: Array<any> = [];

    this.logger.info('[payment_receive] inserting associated entries to the storage.');
    paymentReceive.entries.forEach((entry: any) => {
      const oper = PaymentReceiveEntry.query()
        .insert({
          payment_receive_id: storedPaymentReceive.id,
          ...entry,
        });

      this.logger.info('[payment_receive] increment the sale invoice payment amount.');
      // Increment the invoice payment amount.
      const invoice = SaleInvoice.query()
        .where('id', entry.invoice_id)
        .increment('payment_amount', entry.payment_amount);

      storeOpers.push(oper);
      storeOpers.push(invoice);
    });

    this.logger.info('[payment_receive] decrementing customer balance.');
    const customerIncrementOper = Customer.decrementBalance(
      paymentReceive.customer_id,
      paymentAmount,
    );
    // Records the sale invoice journal transactions.
    const recordJournalTransactions = this.recordPaymentReceiveJournalEntries(tenantId,{
      id: storedPaymentReceive.id,
      ...paymentReceive,
    });
    await Promise.all([
      ...storeOpers,
      customerIncrementOper,
      recordJournalTransactions,
    ]);
    await this.eventDispatcher.dispatch(events.paymentReceipts.onCreated);

    return storedPaymentReceive;
  }

  /**
   * Edit details the given payment receive with associated entries.
   * ------
   * - Update the payment receive transactions.
   * - Insert the new payment receive entries.
   * - Update the given payment receive entries.
   * - Delete the not presented payment receive entries.
   * - Re-insert the journal transactions and update the different accounts balance.
   * - Update the different customer balances.
   * - Update the different invoice payment amount.
   * @async
   * @param {number} tenantId - 
   * @param {Integer} paymentReceiveId -
   * @param {IPaymentReceive} paymentReceive -
   * @param {IPaymentReceive} oldPaymentReceive -
   */
  public async editPaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceive: any,
    oldPaymentReceive: any
  ) {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');
    // Update the payment receive transaction.
    const updatePaymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .update({
        amount: paymentAmount,
        ...formatDateFields(omit(paymentReceive, ['entries']), ['payment_date']),
      });
    const opers = [];
    const entriesIds = paymentReceive.entries.filter((i: any) => i.id);
    const entriesShouldInsert = paymentReceive.entries.filter((i: any) => !i.id);

    // Detarmines which entries ids should be deleted.
    const entriesIdsShouldDelete = ServiceItemsEntries.entriesShouldDeleted(
      oldPaymentReceive.entries,
      entriesIds
    );
    if (entriesIdsShouldDelete.length > 0) {
      // Deletes the given payment receive entries.
      const deleteOper = PaymentReceiveEntryRepository.deleteBulk(
        entriesIdsShouldDelete
      );
      opers.push(deleteOper);
    }
    // Entries that should be updated to the storage.
    if (entriesIds.length > 0) {
      const updateOper = PaymentReceiveEntryRepository.updateBulk(entriesIds);
      opers.push(updateOper);
    }
    // Entries should insert to the storage.
    if (entriesShouldInsert.length > 0) {
      const insertOper = PaymentReceiveEntryRepository.insertBulk(
        entriesShouldInsert,
        paymentReceiveId
      );
      opers.push(insertOper);
    }
    // Re-write the journal transactions of the given payment receive.
    const recordJournalTransactions = this.recordPaymentReceiveJournalEntries(
      tenantId,
      {
        id: oldPaymentReceive.id,
        ...paymentReceive,
      },
      paymentReceiveId,
    );
    // Increment/decrement the customer balance after calc the diff
    // between old and new value.
    const changeCustomerBalance = CustomerRepository.changeDiffBalance(
      paymentReceive.customer_id,
      oldPaymentReceive.customerId,
      paymentAmount * -1,
      oldPaymentReceive.amount * -1,
    );
    // Change the difference between the old and new invoice payment amount.
    const diffInvoicePaymentAmount = this.saveChangeInvoicePaymentAmount(
      tenantId,
      oldPaymentReceive.entries,
      paymentReceive.entries
    );
    // Await the async operations.
    await Promise.all([
      ...opers,
      recordJournalTransactions,
      changeCustomerBalance,
      diffInvoicePaymentAmount,
    ]);
    await this.eventDispatcher.dispatch(events.paymentReceipts.onEdited);
  }

  /**
   * Deletes the given payment receive with associated entries
   * and journal transactions.
   * -----
   * - Deletes the payment receive transaction.
   * - Deletes the payment receive associated entries.
   * - Deletes the payment receive associated journal transactions.
   * - Revert the customer balance.
   * - Revert the payment amount of the associated invoices.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveId - Payment receive id.
   * @param {IPaymentReceive} paymentReceive - Payment receive object.
   */
  async deletePaymentReceive(tenantId: number, paymentReceiveId: number, paymentReceive: any) {
    const { PaymentReceive, PaymentReceiveEntry, Customer } = this.tenancy.models(tenantId);

    // Deletes the payment receive transaction.
    await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .delete();

    // Deletes the payment receive associated entries.
    await PaymentReceiveEntry.query()
      .where('payment_receive_id', paymentReceiveId)
      .delete();

    // Delete all associated journal transactions to payment receive transaction.
    const deleteTransactionsOper = this.journalService.deleteJournalTransactions(
      tenantId,
      paymentReceiveId,
      'PaymentReceive'
    );
    // Revert the customer balance.
    const revertCustomerBalance = Customer.incrementBalance(
      paymentReceive.customerId,
      paymentReceive.amount
    );
    // Revert the invoices payments amount.
    const revertInvoicesPaymentAmount = this.revertInvoicePaymentAmount(
      tenantId,
      paymentReceive.entries.map((entry: any) => ({
        invoiceId: entry.invoiceId,
        revertAmount: entry.paymentAmount,
      }))
    );
    await Promise.all([
      deleteTransactionsOper,
      revertCustomerBalance,
      revertInvoicesPaymentAmount,
    ]);
    await this.eventDispatcher.dispatch(events.paymentReceipts.onDeleted);
  }

  /**
   * Retrieve the payment receive details of the given id.
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveId - Payment receive id.
   */
  public async getPaymentReceive(tenantId: number, paymentReceiveId: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries.invoice')
      .first();
    return paymentReceive;
  }
  
  /**
   * Retrieve payment receives paginated and filterable list.
   * @param {number} tenantId 
   * @param {IPaymentReceivesFilter} paymentReceivesFilter 
   */
  public async listPaymentReceives(tenantId: number, paymentReceivesFilter: IPaymentReceivesFilter) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, PaymentReceive, paymentReceivesFilter);

    const { results, pagination } = await PaymentReceive.query().onBuild((builder) => {
      builder.withGraphFetched('customer');
      builder.withGraphFetched('depositAccount');
      dynamicFilter.buildQuery()(builder);
    }).pagination(
      paymentReceivesFilter.page - 1,
      paymentReceivesFilter.pageSize,
    );
    return {
      paymentReceives: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Retrieve the payment receive details with associated invoices.
   * @param {Integer} paymentReceiveId
   */
  async getPaymentReceiveWithInvoices(tenantId: number, paymentReceiveId: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    return PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('invoices')
      .first();
  }

  /**
   * Detarmines whether the payment receive exists on the storage.
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveId
   */
  async isPaymentReceiveExists(tenantId: number, paymentReceiveId: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceives = await PaymentReceive.query()
      .where('id', paymentReceiveId);
    return paymentReceives.length > 0;
  }

  /**
   * Detarmines the payment receive number existance.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveNumber - Payment receive number.
   * @param {Integer} paymentReceiveId - Payment receive id.
   */
  async isPaymentReceiveNoExists(
    tenantId: number,
    paymentReceiveNumber: string|number,
    paymentReceiveId: number
  ) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceives = await PaymentReceive.query()
      .where('payment_receive_no', paymentReceiveNumber)
      .onBuild((query) => {
        if (paymentReceiveId) {
          query.whereNot('id', paymentReceiveId);
        }
      });
    return paymentReceives.length > 0;
  }

  /**
   * Records payment receive journal transactions.
   * 
   * Invoice payment journals.
   * --------
   * - Account receivable -> Debit
   * - Payment account [current asset] -> Credit
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {IPaymentReceive} paymentReceive
   * @param {Number} paymentReceiveId
   */
  private async recordPaymentReceiveJournalEntries(
    tenantId: number,
    paymentReceive: any,
    paymentReceiveId?: number
  ) {
    const { Account, AccountTransaction } = this.tenancy.models(tenantId);

    const paymentAmount = sumBy(paymentReceive.entries, 'payment_amount');
    const formattedDate = moment(paymentReceive.payment_date).format('YYYY-MM-DD');
    const receivableAccount = await this.accountsService.getAccountByType(
      tenantId,
      'accounts_receivable'
    );
    const accountsDepGraph = await Account.depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);
    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: paymentReceive.id,
      referenceType: 'PaymentReceive',
      date: formattedDate,
    };
    if (paymentReceiveId) {
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['PaymentReceive'])
        .where('reference_id', paymentReceiveId)
        .withGraphFetched('account.type');

      journal.loadEntries(transactions);
      journal.removeEntries();
    }
    const creditReceivable = new JournalEntry({
      ...commonJournal,
      credit: paymentAmount,
      contactType: 'Customer',
      contactId: paymentReceive.customer_id,
      account: receivableAccount.id,
    });
    const debitDepositAccount = new JournalEntry({
      ...commonJournal,
      debit: paymentAmount,
      account: paymentReceive.deposit_account_id,
    });
    journal.credit(creditReceivable);
    journal.debit(debitDepositAccount);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
    ]);
  }

  /**
   * Revert the payment amount of the given invoices ids.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Array} revertInvoices
   * @return {Promise}
   */
  private async revertInvoicePaymentAmount(tenantId: number, revertInvoices: any[]) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const opers: Promise<T>[] = [];

    revertInvoices.forEach((revertInvoice) => {
      const { revertAmount, invoiceId } = revertInvoice;
      const oper = SaleInvoice.query()
        .where('id', invoiceId)
        .decrement('payment_amount', revertAmount);
      opers.push(oper);
    });
    await Promise.all(opers);
  }

  /**
   * Saves difference changing between old and new invoice payment amount.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Array} paymentReceiveEntries
   * @param {Array} newPaymentReceiveEntries
   * @return 
   */
  private async saveChangeInvoicePaymentAmount(
    tenantId: number,
    paymentReceiveEntries: [],
    newPaymentReceiveEntries: [],
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const opers: Promise<T>[] = [];
    const newEntriesTable = chain(newPaymentReceiveEntries)
      .groupBy('invoice_id')
      .mapValues((group) => (sumBy(group, 'payment_amount') || 0) * -1)
      .value();

    const diffEntries = chain(paymentReceiveEntries)
      .groupBy('invoiceId')
      .mapValues((group) => (sumBy(group, 'paymentAmount') || 0) * -1)
      .mapValues((value, key) => value - (newEntriesTable[key] || 0))
      .mapValues((value, key) => ({ invoice_id: key, payment_amount: value }))
      .filter((entry) => entry.payment_amount != 0)
      .values()
      .value();

    diffEntries.forEach((diffEntry: any) => {
      const oper = SaleInvoice.changePaymentAmount(
        diffEntry.invoice_id,
        diffEntry.payment_amount
      );
      opers.push(oper);
    });
    return Promise.all([ ...opers ]);
  }
}
