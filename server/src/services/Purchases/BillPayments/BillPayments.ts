import { Inject, Service } from 'typedi';
import { omit, sumBy, difference } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import moment from 'moment';
import events from 'subscribers/events';
import {
  IBill,
  IBillPaymentDTO,
  IBillPaymentEntryDTO,
  IBillPayment,
  IBillPaymentsFilter,
  IPaginationMeta,
  IFilterMeta,
  IBillPaymentEntry,
} from 'interfaces';
import AccountsService from 'services/Accounts/AccountsService';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import JournalCommands from 'services/Accounting/JournalCommands';
import JournalPosterService from 'services/Sales/JournalPosterService';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { entriesAmountDiff, formatDateFields } from 'utils';
import { ServiceError } from 'exceptions';
import { ACCOUNT_PARENT_TYPE } from 'data/AccountTypes';
import VendorsService from 'services/Contacts/VendorsService';
import { ERRORS } from './constants';

/**
 * Bill payments service.
 * @service
 */
@Service()
export default class BillPaymentsService {
  @Inject()
  accountsService: AccountsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  vendorsService: VendorsService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  /**
   * Validate whether the bill payment vendor exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private async getVendorOrThrowError(tenantId: number, vendorId: number) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Retrieve vendor details of the given id.
    const vendor = await vendorRepository.findOneById(vendorId);

    if (!vendor) {
      throw new ServiceError(ERRORS.BILL_VENDOR_NOT_FOUND);
    }
    return vendor;
  }

  /**
   * Validates the bill payment existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private async getPaymentMadeOrThrowError(
    tenantid: number,
    paymentMadeId: number
  ) {
    const { BillPayment } = this.tenancy.models(tenantid);
    const billPayment = await BillPayment.query()
      .withGraphFetched('entries')
      .findById(paymentMadeId);

    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    return billPayment;
  }

  /**
   * Validates the payment account.
   * @param {number} tenantId -
   * @param {number} paymentAccountId
   * @return {Promise<IAccountType>}
   */
  private async getPaymentAccountOrThrowError(
    tenantId: number,
    paymentAccountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const paymentAccount = await accountRepository.findOneById(
      paymentAccountId
    );
    if (!paymentAccount) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_NOT_FOUND);
    }
    if (!paymentAccount.isParentType(ACCOUNT_PARENT_TYPE.CURRENT_ASSET)) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_NOT_CURRENT_ASSET_TYPE);
    }
    return paymentAccount;
  }

  /**
   * Validates the payment number uniqness.
   * @param {number} tenantId -
   * @param {string} paymentMadeNumber -
   * @return {Promise<IBillPayment>}
   */
  private async validatePaymentNumber(
    tenantId: number,
    paymentMadeNumber: string,
    notPaymentMadeId?: number
  ) {
    const { BillPayment } = this.tenancy.models(tenantId);

    const foundBillPayment = await BillPayment.query().onBuild(
      (builder: any) => {
        builder.findOne('payment_number', paymentMadeNumber);

        if (notPaymentMadeId) {
          builder.whereNot('id', notPaymentMadeId);
        }
      }
    );

    if (foundBillPayment) {
      throw new ServiceError(ERRORS.BILL_PAYMENT_NUMBER_NOT_UNQIUE);
    }
    return foundBillPayment;
  }

  /**
   * Validate whether the entries bills ids exist on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async validateBillsExistance(
    tenantId: number,
    billPaymentEntries: IBillPaymentEntry[],
    vendorId: number
  ) {
    const { Bill } = this.tenancy.models(tenantId);
    const entriesBillsIds = billPaymentEntries.map((e: any) => e.billId);

    const storedBills = await Bill.query()
      .whereIn('id', entriesBillsIds)
      .where('vendor_id', vendorId);

    const storedBillsIds = storedBills.map((t: IBill) => t.id);
    const notFoundBillsIds = difference(entriesBillsIds, storedBillsIds);

    if (notFoundBillsIds.length > 0) {
      throw new ServiceError(ERRORS.BILL_ENTRIES_IDS_NOT_FOUND);
    }

    // Validate the not opened bills.
    const notOpenedBills = storedBills.filter((bill) => !bill.openedAt);

    if (notOpenedBills.length > 0) {
      throw new ServiceError(ERRORS.BILLS_NOT_OPENED_YET, null, {
        notOpenedBills
      });
    }
  }

  /**
   * Validate wether the payment amount bigger than the payable amount.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  private async validateBillsDueAmount(
    tenantId: number,
    billPaymentEntries: IBillPaymentEntryDTO[],
    oldPaymentEntries: IBillPaymentEntry[] = []
  ) {
    const { Bill } = this.tenancy.models(tenantId);
    const billsIds = billPaymentEntries.map(
      (entry: IBillPaymentEntryDTO) => entry.billId
    );

    const storedBills = await Bill.query().whereIn('id', billsIds);
    const storedBillsMap = new Map(
      storedBills.map((bill) => {
        const oldEntries = oldPaymentEntries.filter(
          (entry) => entry.billId === bill.id
        );
        const oldPaymentAmount = sumBy(oldEntries, 'paymentAmount') || 0;

        return [
          bill.id,
          { ...bill, dueAmount: bill.dueAmount + oldPaymentAmount },
        ];
      })
    );
    interface invalidPaymentAmountError {
      index: number;
      due_amount: number;
    }
    const hasWrongPaymentAmount: invalidPaymentAmountError[] = [];

    billPaymentEntries.forEach((entry: IBillPaymentEntryDTO, index: number) => {
      const entryBill = storedBillsMap.get(entry.billId);
      const { dueAmount } = entryBill;

      if (dueAmount < entry.paymentAmount) {
        hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
      }
    });
    if (hasWrongPaymentAmount.length > 0) {
      throw new ServiceError(ERRORS.INVALID_BILL_PAYMENT_AMOUNT);
    }
  }

  /**
   * Validate the payment receive entries IDs existance.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private async validateEntriesIdsExistance(
    tenantId: number,
    billPaymentId: number,
    billPaymentEntries: IBillPaymentEntry[]
  ) {
    const { BillPaymentEntry } = this.tenancy.models(tenantId);

    const entriesIds = billPaymentEntries
      .filter((entry: any) => entry.id)
      .map((entry: any) => entry.id);

    const storedEntries = await BillPaymentEntry.query().where(
      'bill_payment_id',
      billPaymentId
    );

    const storedEntriesIds = storedEntries.map((entry: any) => entry.id);
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      throw new ServiceError(ERRORS.BILL_PAYMENT_ENTRIES_NOT_FOUND);
    }
  }

  /**
   * * Validate the payment vendor whether modified.
   * @param {string} billPaymentNo
   */
  private validateVendorNotModified(
    billPaymentDTO: IBillPaymentDTO,
    oldBillPayment: IBillPayment
  ) {
    if (billPaymentDTO.vendorId !== oldBillPayment.vendorId) {
      throw new ServiceError(ERRORS.PAYMENT_NUMBER_SHOULD_NOT_MODIFY);
    }
  }

  /**
   * Transforms create/edit DTO to model.
   * @param {number} tenantId
   * @param {IBillPaymentDTO} billPaymentDTO - Bill payment.
   * @param {IBillPayment} oldBillPayment - Old bill payment.
   * @return {Promise<IBillPayment>}
   */
  async transformDTOToModel(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO,
    oldBillPayment?: IBillPayment
  ): Promise<IBillPayment> {
    // Retrieve vendor details by the given vendor id.
    const vendor = await this.vendorsService.getVendorByIdOrThrowError(
      tenantId,
      billPaymentDTO.vendorId
    );

    return {
      amount: sumBy(billPaymentDTO.entries, 'paymentAmount'),
      currencyCode: vendor.currencyCode,
      ...formatDateFields(billPaymentDTO, ['paymentDate']),
      entries: billPaymentDTO.entries,
    };
  }

  /**
   * Creates a new bill payment transcations and store it to the storage
   * with associated bills entries and journal transactions.
   *
   * Precedures:-
   * ------
   * - Records the bill payment transaction.
   * - Records the bill payment associated entries.
   * - Increment the payment amount of the given vendor bills.
   * - Decrement the vendor balance.
   * - Records payment journal entries.
   * ------
   * @param {number} tenantId - Tenant id.
   * @param {BillPaymentDTO} billPayment - Bill payment object.
   */
  public async createBillPayment(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO
  ): Promise<IBillPayment> {
    this.logger.info('[paymentDate] trying to save payment made.', {
      tenantId,
      billPaymentDTO,
    });
    const { BillPayment } = this.tenancy.models(tenantId);

    // Transform create DTO to model object.
    const billPaymentObj = await this.transformDTOToModel(
      tenantId,
      billPaymentDTO
    );
    // Validate vendor existance on the storage.
    await this.getVendorOrThrowError(tenantId, billPaymentObj.vendorId);

    // Validate the payment account existance and type.
    await this.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validatePaymentNumber(tenantId, billPaymentObj.paymentNumber);
    }
    // Validates the bills existance and associated to the given vendor.
    await this.validateBillsExistance(
      tenantId,
      billPaymentObj.entries,
      billPaymentDTO.vendorId
    );
    // Validates the bills due payment amount.
    await this.validateBillsDueAmount(tenantId, billPaymentObj.entries);

    const billPayment = await BillPayment.query().insertGraphAndFetch({
      ...billPaymentObj,
    });
    // Triggers `onBillPaymentCreated` event.
    await this.eventDispatcher.dispatch(events.billPayment.onCreated, {
      tenantId,
      billPayment,
      billPaymentId: billPayment.id,
    });
    this.logger.info('[payment_made] inserted successfully.', {
      tenantId,
      billPaymentId: billPayment.id,
    });

    return billPayment;
  }

  /**
   * Edits the details of the given bill payment.
   *
   * Preceducres:
   * ------
   * - Update the bill payment transaction.
   * - Insert the new bill payment entries that have no ids.
   * - Update the bill paymeny entries that have ids.
   * - Delete the bill payment entries that not presented.
   * - Re-insert the journal transactions and update the diff accounts balance.
   * - Update the diff vendor balance.
   * - Update the diff bill payment amount.
   * ------
   * @param {number} tenantId - Tenant id
   * @param {Integer} billPaymentId
   * @param {BillPaymentDTO} billPayment
   * @param {IBillPayment} oldBillPayment
   */
  public async editBillPayment(
    tenantId: number,
    billPaymentId: number,
    billPaymentDTO
  ): Promise<IBillPayment> {
    const { BillPayment } = this.tenancy.models(tenantId);

    const oldBillPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );
    // Transform bill payment DTO to model object.
    const billPaymentObj = await this.transformDTOToModel(
      tenantId,
      billPaymentDTO,
      oldBillPayment
    );
    // Validate vendor not modified.
    this.validateVendorNotModified(billPaymentDTO, oldBillPayment);

    // Validate vendor existance on the storage.
    await this.getVendorOrThrowError(tenantId, billPaymentObj.vendorId);

    // Validate the payment account existance and type.
    await this.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the items entries IDs existance on the storage.
    await this.validateEntriesIdsExistance(
      tenantId,
      billPaymentId,
      billPaymentObj.entries
    );
    // Validate the bills existance and associated to the given vendor.
    await this.validateBillsExistance(
      tenantId,
      billPaymentObj.entries,
      billPaymentDTO.vendorId
    );
    // Validates the bills due payment amount.
    await this.validateBillsDueAmount(
      tenantId,
      billPaymentObj.entries,
      oldBillPayment.entries
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validatePaymentNumber(
        tenantId,
        billPaymentObj.paymentNumber,
        billPaymentId
      );
    }
    const billPayment = await BillPayment.query().upsertGraphAndFetch({
      id: billPaymentId,
      ...billPaymentObj,
    });
    await this.eventDispatcher.dispatch(events.billPayment.onEdited, {
      tenantId,
      billPaymentId,
      billPayment,
      oldBillPayment,
    });
    this.logger.info('[bill_payment] edited successfully.', {
      tenantId,
      billPaymentId,
      billPayment,
      oldBillPayment,
    });

    return billPayment;
  }

  /**
   * Deletes the bill payment and associated transactions.
   * @param {number} tenantId - Tenant id.
   * @param {Integer} billPaymentId - The given bill payment id.
   * @return {Promise}
   */
  public async deleteBillPayment(tenantId: number, billPaymentId: number) {
    const { BillPayment, BillPaymentEntry } = this.tenancy.models(tenantId);

    this.logger.info('[bill_payment] trying to delete.', {
      tenantId,
      billPaymentId,
    });
    const oldBillPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );

    await BillPaymentEntry.query()
      .where('bill_payment_id', billPaymentId)
      .delete();
    await BillPayment.query().where('id', billPaymentId).delete();

    // Triggers `onBillPaymentDeleted` event.
    await this.eventDispatcher.dispatch(events.billPayment.onDeleted, {
      tenantId,
      billPaymentId,
      oldBillPayment,
    });
    this.logger.info('[bill_payment] deleted successfully.', {
      tenantId,
      billPaymentId,
    });
  }

  /**
   * Retrieve payment made associated bills.
   * @param {number} tenantId -
   * @param {number} billPaymentId -
   */
  public async getPaymentBills(tenantId: number, billPaymentId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const billPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );
    const paymentBillsIds = billPayment.entries.map((entry) => entry.id);

    const bills = await Bill.query().whereIn('id', paymentBillsIds);

    return bills;
  }

  /**
   * Retrieve bill payment.
   * @param {number} tenantId
   * @param {number} billPyamentId
   * @return {Promise<IBillPayment>}
   */
  public async getBillPayment(
    tenantId: number,
    billPyamentId: number
  ): Promise<IBillPayment> {
    const { BillPayment } = this.tenancy.models(tenantId);

    const billPayment = await BillPayment.query()
      .withGraphFetched('entries')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('transactions')
      .findById(billPyamentId);

    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    return billPayment;
  }

  /**
   * Records bill payment receive journal transactions.
   * @param {number} tenantId -
   * @param {BillPayment} billPayment
   * @param {Integer} billPaymentId
   */
  public async recordJournalEntries(
    tenantId: number,
    billPayment: IBillPayment,
    override: boolean = false
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const paymentAmount = sumBy(billPayment.entries, 'paymentAmount');
    const formattedDate = moment(billPayment.paymentDate).format('YYYY-MM-DD');

    // Retrieve A/P account from the storage.
    const payableAccount = await accountRepository.findOne({
      slug: 'accounts-payable',
    });

    const journal = new JournalPoster(tenantId);
    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: billPayment.id,
      referenceType: 'BillPayment',
      date: formattedDate,
    };
    if (override) {
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['BillPayment'])
        .where('reference_id', billPayment.id)
        .withGraphFetched('account');

      journal.fromTransactions(transactions);
      journal.removeEntries();
    }
    const debitReceivable = new JournalEntry({
      ...commonJournal,
      debit: paymentAmount,
      contactId: billPayment.vendorId,
      account: payableAccount.id,
      index: 1,
    });
    const creditPaymentAccount = new JournalEntry({
      ...commonJournal,
      credit: paymentAmount,
      account: billPayment.paymentAccountId,
      index: 2,
    });
    journal.debit(debitReceivable);
    journal.credit(creditPaymentAccount);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
      journal.saveContactsBalance(),
    ]);
  }

  /**
   * Reverts bill payment journal entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @return {Promise<void>}
   */
  public async revertJournalEntries(tenantId: number, billPaymentId: number) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    await journalCommands.revertJournalEntries(billPaymentId, 'BillPayment');

    return Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
      journal.saveContactsBalance(),
    ]);
  }

  /**
   * Retrieve bill payment paginted and filterable list.
   * @param {number} tenantId
   * @param {IBillPaymentsFilter} billPaymentsFilter
   */
  public async listBillPayments(
    tenantId: number,
    billPaymentsFilter: IBillPaymentsFilter
  ): Promise<{
    billPayments: IBillPayment;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { BillPayment } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      BillPayment,
      billPaymentsFilter
    );
    this.logger.info('[bill_payment] try to get bill payments list.', {
      tenantId,
    });
    const { results, pagination } = await BillPayment.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('paymentAccount');

        dynamicFilter.buildQuery()(builder);
      })
      .pagination(billPaymentsFilter.page - 1, billPaymentsFilter.pageSize);

    return {
      billPayments: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Saves bills payment amount changes different.
   * @param {number} tenantId -
   * @param {IBillPaymentEntryDTO[]} paymentMadeEntries -
   * @param {IBillPaymentEntryDTO[]} oldPaymentMadeEntries -
   */
  public async saveChangeBillsPaymentAmount(
    tenantId: number,
    paymentMadeEntries: IBillPaymentEntryDTO[],
    oldPaymentMadeEntries?: IBillPaymentEntryDTO[]
  ): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);
    const opers: Promise<void>[] = [];

    const diffEntries = entriesAmountDiff(
      paymentMadeEntries,
      oldPaymentMadeEntries,
      'paymentAmount',
      'billId'
    );
    diffEntries.forEach(
      (diffEntry: { paymentAmount: number; billId: number }) => {
        if (diffEntry.paymentAmount === 0) {
          return;
        }

        const oper = Bill.changePaymentAmount(
          diffEntry.billId,
          diffEntry.paymentAmount
        );
        opers.push(oper);
      }
    );
    await Promise.all(opers);
  }
}
