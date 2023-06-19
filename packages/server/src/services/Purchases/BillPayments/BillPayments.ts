import { Inject, Service } from 'typedi';
import { sumBy, difference } from 'lodash';
import * as R from 'ramda';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IBill,
  IBillPaymentDTO,
  IBillPaymentEntryDTO,
  IBillPayment,
  IBillPaymentsFilter,
  IPaginationMeta,
  IFilterMeta,
  IBillPaymentEntry,
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
  IBillPaymentEventDeletedPayload,
  IBillPaymentCreatingPayload,
  IBillPaymentEditingPayload,
  IBillPaymentDeletingPayload,
  IVendor,
} from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { entriesAmountDiff, formatDateFields } from 'utils';
import { ServiceError } from '@/exceptions';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { BillPaymentTransformer } from './BillPaymentTransformer';
import { ERRORS } from './constants';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TenantMetadata } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Bill payments service.
 * @service
 */
@Service('BillPayments')
export default class BillPaymentsService implements IBillPaymentsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Validates the bill payment existence.
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
    // Validate the payment account type.
    if (
      !paymentAccount.isAccountType([
        ACCOUNT_TYPE.BANK,
        ACCOUNT_TYPE.CASH,
        ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
      ])
    ) {
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
  public async validateBillsExistence(
    tenantId: number,
    billPaymentEntries: { billId: number }[],
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
        notOpenedBills,
      });
    }
    return storedBills;
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
   * Validate the payment receive entries IDs existence.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private async validateEntriesIdsExistence(
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
   * Validates the payment account currency code. The deposit account currency
   * should be equals the customer currency code or the base currency.
   * @param  {string} paymentAccountCurrency
   * @param  {string} customerCurrency
   * @param  {string} baseCurrency
   * @throws {ServiceError(ERRORS.WITHDRAWAL_ACCOUNT_CURRENCY_INVALID)}
   */
  public validateWithdrawalAccountCurrency = (
    paymentAccountCurrency: string,
    customerCurrency: string,
    baseCurrency: string
  ) => {
    if (
      paymentAccountCurrency !== customerCurrency &&
      paymentAccountCurrency !== baseCurrency
    ) {
      throw new ServiceError(ERRORS.WITHDRAWAL_ACCOUNT_CURRENCY_INVALID);
    }
  };

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
    vendor: IVendor,
    oldBillPayment?: IBillPayment
  ): Promise<IBillPayment> {
    const initialDTO = {
      ...formatDateFields(billPaymentDTO, ['paymentDate']),
      amount: sumBy(billPaymentDTO.entries, 'paymentAmount'),
      currencyCode: vendor.currencyCode,
      exchangeRate: billPaymentDTO.exchangeRate || 1,
      entries: billPaymentDTO.entries,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IBillPayment>(tenantId)
    )(initialDTO);
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
    const { BillPayment, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Retrieves the payment vendor or throw not found error.
    const vendor = await Contact.query()
      .findById(billPaymentDTO.vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Transform create DTO to model object.
    const billPaymentObj = await this.transformDTOToModel(
      tenantId,
      billPaymentDTO,
      vendor
    );
    // Validate the payment account existence and type.
    const paymentAccount = await this.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validatePaymentNumber(tenantId, billPaymentObj.paymentNumber);
    }
    // Validates the bills existence and associated to the given vendor.
    await this.validateBillsExistence(
      tenantId,
      billPaymentObj.entries,
      billPaymentDTO.vendorId
    );
    // Validates the bills due payment amount.
    await this.validateBillsDueAmount(tenantId, billPaymentObj.entries);

    // Validates the withdrawal account currency code.
    this.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.baseCurrency
    );
    // Writes bill payment transacation with associated transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentCreating` event.
      await this.eventPublisher.emitAsync(events.billPayment.onCreating, {
        tenantId,
        billPaymentDTO,
        trx,
      } as IBillPaymentCreatingPayload);

      // Writes the bill payment graph to the storage.
      const billPayment = await BillPayment.query(trx).insertGraphAndFetch({
        ...billPaymentObj,
      });

      // Triggers `onBillPaymentCreated` event.
      await this.eventPublisher.emitAsync(events.billPayment.onCreated, {
        tenantId,
        billPayment,
        billPaymentId: billPayment.id,
        trx,
      } as IBillPaymentEventCreatedPayload);

      return billPayment;
    });
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
    const { BillPayment, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    //
    const oldBillPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );

    //
    const vendor = await Contact.query()
      .modify('vendor')
      .findById(billPaymentDTO.vendorId)
      .throwIfNotFound();

    // Transform bill payment DTO to model object.
    const billPaymentObj = await this.transformDTOToModel(
      tenantId,
      billPaymentDTO,
      vendor,
      oldBillPayment
    );
    // Validate vendor not modified.
    this.validateVendorNotModified(billPaymentDTO, oldBillPayment);

    // Validate the payment account existence and type.
    const paymentAccount = await this.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the items entries IDs existence on the storage.
    await this.validateEntriesIdsExistence(
      tenantId,
      billPaymentId,
      billPaymentObj.entries
    );
    // Validate the bills existence and associated to the given vendor.
    await this.validateBillsExistence(
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
    // Validates the withdrawal account currency code.
    this.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.baseCurrency
    );
    // Edits the bill transactions with associated transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentEditing` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEditing, {
        tenantId,
        oldBillPayment,
        billPaymentDTO,
        trx,
      } as IBillPaymentEditingPayload);

      // Deletes the bill payment transaction graph from the storage.
      const billPayment = await BillPayment.query(trx).upsertGraphAndFetch({
        id: billPaymentId,
        ...billPaymentObj,
      });
      // Triggers `onBillPaymentEdited` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEdited, {
        tenantId,
        billPaymentId,
        billPayment,
        oldBillPayment,
        trx,
      } as IBillPaymentEventEditedPayload);

      return billPayment;
    });
  }

  /**
   * Deletes the bill payment and associated transactions.
   * @param  {number} tenantId - Tenant id.
   * @param  {Integer} billPaymentId - The given bill payment id.
   * @return {Promise}
   */
  public async deleteBillPayment(tenantId: number, billPaymentId: number) {
    const { BillPayment, BillPaymentEntry } = this.tenancy.models(tenantId);

    // Retrieve the bill payment or throw not found service error.
    const oldBillPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );
    // Deletes the bill transactions with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentDeleting` payload.
      await this.eventPublisher.emitAsync(events.billPayment.onDeleting, {
        tenantId,
        trx,
        oldBillPayment,
      } as IBillPaymentDeletingPayload);

      // Deletes the bill payment associated entries.
      await BillPaymentEntry.query(trx)
        .where('bill_payment_id', billPaymentId)
        .delete();

      // Deletes the bill payment transaction.
      await BillPayment.query(trx).where('id', billPaymentId).delete();

      // Triggers `onBillPaymentDeleted` event.
      await this.eventPublisher.emitAsync(events.billPayment.onDeleted, {
        tenantId,
        billPaymentId,
        oldBillPayment,
        trx,
      } as IBillPaymentEventDeletedPayload);
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
      .withGraphFetched('entries.bill')
      .withGraphFetched('vendor')
      .withGraphFetched('paymentAccount')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .findById(billPyamentId);

    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    return this.transformer.transform(
      tenantId,
      billPayment,
      new BillPaymentTransformer()
    );
  }

  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve bill payment paginated and filterable list.
   * @param {number} tenantId
   * @param {IBillPaymentsFilter} billPaymentsFilter
   */
  public async listBillPayments(
    tenantId: number,
    filterDTO: IBillPaymentsFilter
  ): Promise<{
    billPayments: IBillPayment;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { BillPayment } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      BillPayment,
      filter
    );

    const { results, pagination } = await BillPayment.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('paymentAccount');

        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the bill payments models to POJO.
    const billPayments = await this.transformer.transform(
      tenantId,
      results,
      new BillPaymentTransformer()
    );
    return {
      billPayments,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
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
    oldPaymentMadeEntries?: IBillPaymentEntryDTO[],
    trx?: Knex.Transaction
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
          diffEntry.paymentAmount,
          trx
        );
        opers.push(oper);
      }
    );
    await Promise.all(opers);
  }

  /**
   * Validates the given vendor has no associated payments.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public async validateVendorHasNoPayments(tenantId: number, vendorId: number) {
    const { BillPayment } = this.tenancy.models(tenantId);

    const payments = await BillPayment.query().where('vendor_id', vendorId);

    if (payments.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_PAYMENTS);
    }
  }
}
