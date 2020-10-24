import { Inject, Service } from 'typedi';
import { entries, omit, sumBy, difference } from 'lodash';
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
import { formatDateFields } from 'utils';
import { ServiceError } from 'exceptions';

const ERRORS = {
  BILL_VENDOR_NOT_FOUND: 'VENDOR_NOT_FOUND',
  PAYMENT_MADE_NOT_FOUND: 'PAYMENT_MADE_NOT_FOUND',
  BILL_PAYMENT_NUMBER_NOT_UNQIUE: 'BILL_PAYMENT_NUMBER_NOT_UNQIUE',
  PAYMENT_ACCOUNT_NOT_FOUND: 'PAYMENT_ACCOUNT_NOT_FOUND',
  PAYMENT_ACCOUNT_NOT_CURRENT_ASSET_TYPE: 'PAYMENT_ACCOUNT_NOT_CURRENT_ASSET_TYPE',
  BILL_ENTRIES_IDS_NOT_FOUND: 'BILL_ENTRIES_IDS_NOT_FOUND',
  BILL_PAYMENT_ENTRIES_NOT_FOUND: 'BILL_PAYMENT_ENTRIES_NOT_FOUND',
  INVALID_BILL_PAYMENT_AMOUNT: 'INVALID_BILL_PAYMENT_AMOUNT',
};

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
    const vendor = await vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new ServiceError(ERRORS.BILL_VENDOR_NOT_FOUND)
    }
    return vendor;
  }

  /**
   * Validates the bill payment existance. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  private async getPaymentMadeOrThrowError(tenantid: number, paymentMadeId: number) {
    const { BillPayment } = this.tenancy.models(tenantid);
    const billPayment = await BillPayment.query().findById(paymentMadeId);

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
  private async getPaymentAccountOrThrowError(tenantId: number, paymentAccountId: number) {
    const { accountTypeRepository, accountRepository } = this.tenancy.repositories(tenantId);

    const currentAssetTypes = await accountTypeRepository.getByChildType('current_asset');
    const paymentAccount = await accountRepository.findById(paymentAccountId);

    const currentAssetTypesIds = currentAssetTypes.map(type => type.id);

    if (!paymentAccount) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_NOT_FOUND);
    }
    if (currentAssetTypesIds.indexOf(paymentAccount.accountTypeId) === -1) {
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
  private async validatePaymentNumber(tenantId: number, paymentMadeNumber: string, notPaymentMadeId?: string) {
    const { BillPayment } = this.tenancy.models(tenantId);
  
    const foundBillPayment = await BillPayment.query()
      .onBuild((builder: any) => {
        builder.findOne('payment_number', paymentMadeNumber);

        if (notPaymentMadeId) {
          builder.whereNot('id', notPaymentMadeId);
        }
      });
 
    if (foundBillPayment) {
      throw new ServiceError(ERRORS.BILL_PAYMENT_NUMBER_NOT_UNQIUE)
    }
    return foundBillPayment;
  }

  /**
   * Validate whether the entries bills ids exist on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  private async validateBillsExistance(tenantId: number, billPaymentEntries: IBillPaymentEntry[], notVendorId?: number) {
    const { Bill } = this.tenancy.models(tenantId);
    const entriesBillsIds = billPaymentEntries.map((e: any) => e.billId);

    const storedBills = await Bill.query().onBuild((builder) => {
      builder.whereIn('id', entriesBillsIds);

      if (notVendorId) {
        builder.where('vendor_id', notVendorId);
      }
    });
    const storedBillsIds = storedBills.map((t: IBill) => t.id);
    const notFoundBillsIds = difference(entriesBillsIds, storedBillsIds);

    if (notFoundBillsIds.length > 0) {
      throw new ServiceError(ERRORS.BILL_ENTRIES_IDS_NOT_FOUND)
    }
  }

  /**
   * Validate wether the payment amount bigger than the payable amount.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @return {void}
   */
  private async validateBillsDueAmount(tenantId: number, billPaymentEntries: IBillPaymentEntryDTO[]) {
    const { Bill } = this.tenancy.models(tenantId);
    const billsIds = billPaymentEntries.map((entry: IBillPaymentEntryDTO) => entry.billId);

    const storedBills = await Bill.query().whereIn('id', billsIds);
    const storedBillsMap = new Map(
      storedBills.map((bill: any) => [bill.id, bill]),
    );
    interface invalidPaymentAmountError{
      index: number,
      due_amount: number
    };
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

    const storedEntries = await BillPaymentEntry.query().where('bill_payment_id', billPaymentId);

    const storedEntriesIds = storedEntries.map((entry: any) => entry.id);    
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      throw new ServiceError(ERRORS.BILL_PAYMENT_ENTRIES_NOT_FOUND);
    }
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
    this.logger.info('[paymentDate] trying to save payment made.', { tenantId, billPaymentDTO });
    const { BillPayment } = this.tenancy.models(tenantId);

    const billPaymentObj = {
      amount: sumBy(billPaymentDTO.entries, 'paymentAmount'),
      ...formatDateFields(billPaymentDTO, ['paymentDate']),
    };
    await this.getVendorOrThrowError(tenantId, billPaymentObj.vendorId);
    await this.getPaymentAccountOrThrowError(tenantId, billPaymentObj.paymentAccountId);
    await this.validatePaymentNumber(tenantId, billPaymentObj.paymentNumber);
    await this.validateBillsExistance(tenantId, billPaymentObj.entries);
    await this.validateBillsDueAmount(tenantId, billPaymentObj.entries);

    const billPayment = await BillPayment.query()
      .insertGraph({
        ...omit(billPaymentObj, ['entries']),
        entries: billPaymentDTO.entries,
      });

    await this.eventDispatcher.dispatch(events.billPayments.onCreated, {
      tenantId, billPayment, billPaymentId: billPayment.id,
    });
    this.logger.info('[payment_made] inserted successfully.', { tenantId, billPaymentId: billPayment.id, });

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
   * @param {number} tenantId - Tenant id
   * @param {Integer} billPaymentId
   * @param {BillPaymentDTO} billPayment
   * @param {IBillPayment} oldBillPayment
   */
  public async editBillPayment(
    tenantId: number,
    billPaymentId: number,
    billPaymentDTO,
  ): Promise<IBillPayment> {
    const { BillPayment } = this.tenancy.models(tenantId);

    const oldPaymentMade = await this.getPaymentMadeOrThrowError(tenantId, billPaymentId);

    const billPaymentObj = {
      amount: sumBy(billPaymentDTO.entries, 'paymentAmount'),
      ...formatDateFields(billPaymentDTO, ['paymentDate']),
    };

    await this.getVendorOrThrowError(tenantId, billPaymentObj.vendorId);
    await this.getPaymentAccountOrThrowError(tenantId, billPaymentObj.paymentAccountId);
    await this.validateEntriesIdsExistance(tenantId, billPaymentId, billPaymentObj.entries);
    await this.validateBillsExistance(tenantId, billPaymentObj.entries);
    await this.validateBillsDueAmount(tenantId, billPaymentObj.entries);

    const billPayment = await BillPayment.query()
      .upsertGraph({
        id: billPaymentId,
        ...omit(billPaymentObj, ['entries']),
      });
    await this.eventDispatcher.dispatch(events.billPayments.onEdited);
    this.logger.info('[bill_payment] edited successfully.', { tenantId, billPaymentId, billPayment, oldPaymentMade });

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
    
    this.logger.info('[bill_payment] trying to delete.', { tenantId, billPaymentId });
    const oldPaymentMade = await this.getPaymentMadeOrThrowError(tenantId, billPaymentId);

    await BillPaymentEntry.query().where('bill_payment_id', billPaymentId).delete();
    await BillPayment.query().where('id', billPaymentId).delete();

    await this.eventDispatcher.dispatch(events.billPayments.onDeleted, { tenantId, billPaymentId, oldPaymentMade });
    this.logger.info('[bill_payment] deleted successfully.', { tenantId, billPaymentId });
  }

  /**
   * Records bill payment receive journal transactions.
   * @param {number} tenantId - 
   * @param {BillPayment} billPayment
   * @param {Integer} billPaymentId
   */
  public async recordJournalEntries(tenantId: number, billPayment: IBillPayment) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const paymentAmount = sumBy(billPayment.entries, 'paymentAmount');
    const formattedDate = moment(billPayment.paymentDate).format('YYYY-MM-DD');
    const payableAccount = await accountRepository.getBySlug('accounts-payable');

    const journal = new JournalPoster(tenantId);
    const commonJournal = {
      debit: 0,
      credit: 0,
      referenceId: billPayment.id,
      referenceType: 'BillPayment',
      date: formattedDate,
    };
    if (billPayment.id) {
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['BillPayment'])
        .where('reference_id', billPayment.id)
        .withGraphFetched('account.type');

      journal.loadEntries(transactions);
      journal.removeEntries();
    }
    const debitReceivable = new JournalEntry({
      ...commonJournal,
      debit: paymentAmount,
      contactType: 'Vendor',
      contactId: billPayment.vendorId,
      account: payableAccount.id,
    });
    const creditPaymentAccount = new JournalEntry({
      ...commonJournal,
      credit: paymentAmount,
      account: billPayment.paymentAccountId,
    });
    journal.debit(debitReceivable);
    journal.credit(creditPaymentAccount);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveEntries(),
      journal.saveBalance(),
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
    ]);
  }

  /**
   * Retrieve bill payment paginted and filterable list.
   * @param {number} tenantId 
   * @param {IBillPaymentsFilter} billPaymentsFilter 
   */
  public async listBillPayments(
    tenantId: number,
    billPaymentsFilter: IBillPaymentsFilter,
  ): Promise<{ billPayments: IBillPayment, pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { BillPayment } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, BillPayment, billPaymentsFilter);

    this.logger.info('[bill_payment] try to get bill payments list.', { tenantId });
    const { results, pagination } = await BillPayment.query().onBuild((builder) => {
      builder.withGraphFetched('vendor');
      builder.withGraphFetched('paymentAccount');
      dynamicFilter.buildQuery()(builder);
    }).pagination(
      billPaymentsFilter.page - 1,
      billPaymentsFilter.pageSize,
    );

    return {
      billPayments: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Retrieve bill payment with associated metadata.
   * @param {number} billPaymentId - The bill payment id.
   * @return {object}
   */
  public async getBillPayment(tenantId: number, billPaymentId: number) {
    const { BillPayment } = this.tenancy.models(tenantId);
    const billPayment = await BillPayment.query()
      .findById(billPaymentId)
      .withGraphFetched('entries')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount');
    
    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    return billPayment;
  }
}
