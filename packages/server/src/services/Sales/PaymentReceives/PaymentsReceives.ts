import { omit, sumBy, difference } from 'lodash';
import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IAccount,
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceive,
  IPaymentReceiveCreateDTO,
  IPaymentReceiveEditDTO,
  IPaymentReceiveEntry,
  IPaymentReceiveEntryDTO,
  IPaymentReceivesFilter,
  IPaymentsReceiveService,
  IPaymentReceiveCreatedPayload,
  ISaleInvoice,
  ISystemUser,
  IPaymentReceiveEditedPayload,
  IPaymentReceiveDeletedPayload,
  IPaymentReceiveCreatingPayload,
  IPaymentReceiveDeletingPayload,
  IPaymentReceiveEditingPayload,
  ICustomer,
} from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { formatDateFields, entriesAmountDiff } from 'utils';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { PaymentReceiveTransfromer } from './PaymentReceiveTransformer';
import UnitOfWork from '@/services/UnitOfWork';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TenantMetadata } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Payment receive service.
 * @service
 */
@Service('PaymentReceives')
export default class PaymentReceiveService implements IPaymentsReceiveService {
  @Inject()
  itemsEntries: ItemsEntriesService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject('logger')
  logger: any;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  transformer: TransformerInjectable;

  /**
   * Validates the payment receive number existance.
   * @param {number} tenantId -
   * @param {string} paymentReceiveNo -
   */
  async validatePaymentReceiveNoExistance(
    tenantId: number,
    paymentReceiveNo: string,
    notPaymentReceiveId?: number
  ): Promise<void> {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceive = await PaymentReceive.query()
      .findOne('payment_receive_no', paymentReceiveNo)
      .onBuild((builder) => {
        if (notPaymentReceiveId) {
          builder.whereNot('id', notPaymentReceiveId);
        }
      });

    if (paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NO_EXISTS);
    }
  }

  /**
   * Validates the payment receive existance.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   */
  async getPaymentReceiveOrThrowError(
    tenantId: number,
    paymentReceiveId: number
  ): Promise<IPaymentReceive> {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceive = await PaymentReceive.query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId);

    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    return paymentReceive;
  }

  /**
   * Validate the deposit account id existance.
   * @param {number} tenantId - Tenant id.
   * @param {number} depositAccountId - Deposit account id.
   * @return {Promise<IAccount>}
   */
  async getDepositAccountOrThrowError(
    tenantId: number,
    depositAccountId: number
  ): Promise<IAccount> {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const depositAccount = await accountRepository.findOneById(
      depositAccountId
    );
    if (!depositAccount) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_FOUND);
    }
    // Determines whether the account is cash, bank or other current asset.
    if (
      !depositAccount.isAccountType([
        ACCOUNT_TYPE.CASH,
        ACCOUNT_TYPE.BANK,
        ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
      ])
    ) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_INVALID_TYPE);
    }
    return depositAccount;
  }

  /**
   * Validates the invoices IDs existance.
   * @param {number} tenantId -
   * @param {number} customerId -
   * @param {IPaymentReceiveEntryDTO[]} paymentReceiveEntries -
   */
  async validateInvoicesIDsExistance(
    tenantId: number,
    customerId: number,
    paymentReceiveEntries: { invoiceId: number }[]
  ): Promise<ISaleInvoice[]> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoicesIds = paymentReceiveEntries.map(
      (e: { invoiceId: number }) => e.invoiceId
    );
    const storedInvoices = await SaleInvoice.query()
      .whereIn('id', invoicesIds)
      .where('customer_id', customerId);

    const storedInvoicesIds = storedInvoices.map((invoice) => invoice.id);
    const notFoundInvoicesIDs = difference(invoicesIds, storedInvoicesIds);

    if (notFoundInvoicesIDs.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_IDS_NOT_FOUND);
    }
    // Filters the not delivered invoices.
    const notDeliveredInvoices = storedInvoices.filter(
      (invoice) => !invoice.isDelivered
    );
    if (notDeliveredInvoices.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_NOT_DELIVERED_YET, null, {
        notDeliveredInvoices,
      });
    }
    return storedInvoices;
  }

  /**
   * Validates entries invoice payment amount.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateInvoicesPaymentsAmount(
    tenantId: number,
    paymentReceiveEntries: IPaymentReceiveEntryDTO[],
    oldPaymentEntries: IPaymentReceiveEntry[] = []
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const invoicesIds = paymentReceiveEntries.map(
      (e: IPaymentReceiveEntryDTO) => e.invoiceId
    );

    const storedInvoices = await SaleInvoice.query().whereIn('id', invoicesIds);

    const storedInvoicesMap = new Map(
      storedInvoices.map((invoice: ISaleInvoice) => {
        const oldEntries = oldPaymentEntries.filter((entry) => entry.invoiceId);
        const oldPaymentAmount = sumBy(oldEntries, 'paymentAmount') || 0;

        return [
          invoice.id,
          { ...invoice, dueAmount: invoice.dueAmount + oldPaymentAmount },
        ];
      })
    );
    const hasWrongPaymentAmount: any[] = [];

    paymentReceiveEntries.forEach(
      (entry: IPaymentReceiveEntryDTO, index: number) => {
        const entryInvoice = storedInvoicesMap.get(entry.invoiceId);
        const { dueAmount } = entryInvoice;

        if (dueAmount < entry.paymentAmount) {
          hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
        }
      }
    );
    if (hasWrongPaymentAmount.length > 0) {
      throw new ServiceError(ERRORS.INVALID_PAYMENT_AMOUNT);
    }
  }

  /**
   * Retrieve the next unique payment receive number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  getNextPaymentReceiveNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'payment_receives'
    );
  }

  /**
   * Increment the payment receive next number.
   * @param {number} tenantId
   */
  incrementNextPaymentReceiveNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'payment_receives'
    );
  }

  /**
   * Validate the payment receive number require.
   * @param {IPaymentReceive} paymentReceiveObj
   */
  validatePaymentReceiveNoRequire(paymentReceiveObj: IPaymentReceive) {
    if (!paymentReceiveObj.paymentReceiveNo) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the payment receive entries IDs existance.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {IPaymentReceiveEntryDTO[]} paymentReceiveEntries
   */
  private async validateEntriesIdsExistance(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveEntries: IPaymentReceiveEntryDTO[]
  ) {
    const { PaymentReceiveEntry } = this.tenancy.models(tenantId);

    const entriesIds = paymentReceiveEntries
      .filter((entry) => entry.id)
      .map((entry) => entry.id);

    const storedEntries = await PaymentReceiveEntry.query().where(
      'payment_receive_id',
      paymentReceiveId
    );
    const storedEntriesIds = storedEntries.map((entry: any) => entry.id);
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      throw new ServiceError(ERRORS.ENTRIES_IDS_NOT_EXISTS);
    }
  }

  /**
   * Validates the payment receive number require.
   * @param {string} paymentReceiveNo
   */
  validatePaymentNoRequire(paymentReceiveNo: string) {
    if (!paymentReceiveNo) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NO_REQUIRED);
    }
  }

  /**
   * Validate the payment customer whether modified.
   * @param {IPaymentReceiveEditDTO} paymentReceiveDTO
   * @param {IPaymentReceive} oldPaymentReceive
   */
  validateCustomerNotModified(
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    oldPaymentReceive: IPaymentReceive
  ) {
    if (paymentReceiveDTO.customerId !== oldPaymentReceive.customerId) {
      throw new ServiceError(ERRORS.PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE);
    }
  }

  /**
   * Validates the payment account currency code. The deposit account currency
   * should be equals the customer currency code or the base currency.
   * @param  {string} paymentAccountCurrency
   * @param  {string} customerCurrency
   * @param  {string} baseCurrency
   * @throws {ServiceError(ERRORS.PAYMENT_ACCOUNT_CURRENCY_INVALID)}
   */
  public validatePaymentAccountCurrency = (
    paymentAccountCurrency: string,
    customerCurrency: string,
    baseCurrency: string
  ) => {
    if (
      paymentAccountCurrency !== customerCurrency &&
      paymentAccountCurrency !== baseCurrency
    ) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_CURRENCY_INVALID);
    }
  };

  /**
   * Transformes the create payment receive DTO to model object.
   * @param {number} tenantId
   * @param {IPaymentReceiveCreateDTO|IPaymentReceiveEditDTO} paymentReceiveDTO - Payment receive DTO.
   * @param {IPaymentReceive} oldPaymentReceive -
   * @return {IPaymentReceive}
   */
  async transformPaymentReceiveDTOToModel(
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveCreateDTO | IPaymentReceiveEditDTO,
    oldPaymentReceive?: IPaymentReceive
  ): Promise<IPaymentReceive> {
    const paymentAmount = sumBy(paymentReceiveDTO.entries, 'paymentAmount');

    // Retreive the next invoice number.
    const autoNextNumber = this.getNextPaymentReceiveNumber(tenantId);

    // Retrieve the next payment receive number.
    const paymentReceiveNo =
      paymentReceiveDTO.paymentReceiveNo ||
      oldPaymentReceive?.paymentReceiveNo ||
      autoNextNumber;

    this.validatePaymentNoRequire(paymentReceiveNo);

    const initialDTO = {
      ...formatDateFields(omit(paymentReceiveDTO, ['entries']), [
        'paymentDate',
      ]),
      amount: paymentAmount,
      currencyCode: customer.currencyCode,
      ...(paymentReceiveNo ? { paymentReceiveNo } : {}),
      exchangeRate: paymentReceiveDTO.exchangeRate || 1,
      entries: paymentReceiveDTO.entries.map((entry) => ({
        ...entry,
      })),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<IPaymentReceive>(tenantId)
    )(initialDTO);
  }

  /**
   * Transform the create payment receive DTO.
   * @param {number} tenantId
   * @param {ICustomer} customer
   * @param {IPaymentReceiveCreateDTO} paymentReceiveDTO
   * @returns
   */
  private transformCreateDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveCreateDTO
  ) => {
    return this.transformPaymentReceiveDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO
    );
  };

  /**
   * Transform the edit payment receive DTO.
   * @param {number} tenantId
   * @param {ICustomer} customer
   * @param {IPaymentReceiveEditDTO} paymentReceiveDTO
   * @param {IPaymentReceive} oldPaymentReceive
   * @returns
   */
  private transformEditDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    oldPaymentReceive: IPaymentReceive
  ) => {
    return this.transformPaymentReceiveDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO,
      oldPaymentReceive
    );
  };
  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {IPaymentReceive} paymentReceive
   */
  public async createPaymentReceive(
    tenantId: number,
    paymentReceiveDTO: IPaymentReceiveCreateDTO,
    authorizedUser: ISystemUser
  ) {
    const { PaymentReceive, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Validate customer existance.
    const paymentCustomer = await Contact.query()
      .modify('customer')
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformCreateDTOToModel(
      tenantId,
      paymentCustomer,
      paymentReceiveDTO
    );
    // Validate payment receive number uniquiness.
    await this.validatePaymentReceiveNoExistance(
      tenantId,
      paymentReceiveObj.paymentReceiveNo
    );
    // Validate the deposit account existance and type.
    const depositAccount = await this.getDepositAccountOrThrowError(
      tenantId,
      paymentReceiveDTO.depositAccountId
    );
    // Validate payment receive invoices IDs existance.
    await this.validateInvoicesIDsExistance(
      tenantId,
      paymentReceiveDTO.customerId,
      paymentReceiveDTO.entries
    );
    // Validate invoice payment amount.
    await this.validateInvoicesPaymentsAmount(
      tenantId,
      paymentReceiveDTO.entries
    );
    // Validates the payment account currency code.
    this.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      paymentCustomer.currencyCode,
      tenantMeta.baseCurrency
    );
    // Creates a payment receive transaction under UOW envirment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveCreating` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onCreating, {
        trx,
        paymentReceiveDTO,
        tenantId,
      } as IPaymentReceiveCreatingPayload);

      // Inserts the payment receive transaction.
      const paymentReceive = await PaymentReceive.query(
        trx
      ).insertGraphAndFetch({
        ...paymentReceiveObj,
      });
      // Triggers `onPaymentReceiveCreated` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onCreated, {
        tenantId,
        paymentReceive,
        paymentReceiveId: paymentReceive.id,
        authorizedUser,
        trx,
      } as IPaymentReceiveCreatedPayload);

      return paymentReceive;
    });
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
   */
  public async editPaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    authorizedUser: ISystemUser
  ) {
    const { PaymentReceive, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Validate the payment receive existance.
    const oldPaymentReceive = await this.getPaymentReceiveOrThrowError(
      tenantId,
      paymentReceiveId
    );
    // Validate customer existance.
    const customer = await Contact.query()
      .modify('customer')
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformEditDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO,
      oldPaymentReceive
    );
    // Validate customer whether modified.
    this.validateCustomerNotModified(paymentReceiveDTO, oldPaymentReceive);

    // Validate payment receive number uniquiness.
    if (paymentReceiveDTO.paymentReceiveNo) {
      await this.validatePaymentReceiveNoExistance(
        tenantId,
        paymentReceiveDTO.paymentReceiveNo,
        paymentReceiveId
      );
    }
    // Validate the deposit account existance and type.
    const depositAccount = await this.getDepositAccountOrThrowError(
      tenantId,
      paymentReceiveDTO.depositAccountId
    );
    // Validate the entries ids existance on payment receive type.
    await this.validateEntriesIdsExistance(
      tenantId,
      paymentReceiveId,
      paymentReceiveDTO.entries
    );
    // Validate payment receive invoices IDs existance and associated
    // to the given customer id.
    await this.validateInvoicesIDsExistance(
      tenantId,
      oldPaymentReceive.customerId,
      paymentReceiveDTO.entries
    );
    // Validate invoice payment amount.
    await this.validateInvoicesPaymentsAmount(
      tenantId,
      paymentReceiveDTO.entries,
      oldPaymentReceive.entries
    );
    // Validates the payment account currency code.
    this.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      customer.currencyCode,
      tenantMeta.baseCurrency
    );
    // Creates payment receive transaction under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveEditing` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEditing, {
        trx,
        tenantId,
        oldPaymentReceive,
        paymentReceiveDTO,
      } as IPaymentReceiveEditingPayload);

      // Update the payment receive transaction.
      const paymentReceive = await PaymentReceive.query(
        trx
      ).upsertGraphAndFetch({
        id: paymentReceiveId,
        ...paymentReceiveObj,
      });
      // Triggers `onPaymentReceiveEdited` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEdited, {
        tenantId,
        paymentReceiveId,
        paymentReceive,
        oldPaymentReceive,
        authorizedUser,
        trx,
      } as IPaymentReceiveEditedPayload);

      return paymentReceive;
    });
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
  public async deletePaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    authorizedUser: ISystemUser
  ) {
    const { PaymentReceive, PaymentReceiveEntry } =
      this.tenancy.models(tenantId);

    // Retreive payment receive or throw not found service error.
    const oldPaymentReceive = await this.getPaymentReceiveOrThrowError(
      tenantId,
      paymentReceiveId
    );
    // Delete payment receive transaction and associate transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveDeleting` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleting, {
        tenantId,
        oldPaymentReceive,
        trx,
      } as IPaymentReceiveDeletingPayload);

      // Deletes the payment receive associated entries.
      await PaymentReceiveEntry.query(trx)
        .where('payment_receive_id', paymentReceiveId)
        .delete();

      // Deletes the payment receive transaction.
      await PaymentReceive.query(trx).findById(paymentReceiveId).delete();

      // Triggers `onPaymentReceiveDeleted` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleted, {
        tenantId,
        paymentReceiveId,
        oldPaymentReceive,
        authorizedUser,
        trx,
      } as IPaymentReceiveDeletedPayload);
    });
  }

  /**
   * Retrieve payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<IPaymentReceive>}
   */
  public async getPaymentReceive(
    tenantId: number,
    paymentReceiveId: number
  ): Promise<IPaymentReceive> {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .withGraphFetched('customer')
      .withGraphFetched('depositAccount')
      .withGraphFetched('entries.invoice')
      .withGraphFetched('transactions')
      .withGraphFetched('branch')
      .findById(paymentReceiveId);

    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    return this.transformer.transform(
      tenantId,
      paymentReceive,
      new PaymentReceiveTransfromer()
    );
  }

  /**
   * Retrieve sale invoices that associated to the given payment receive.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<ISaleInvoice>}
   */
  public async getPaymentReceiveInvoices(
    tenantId: number,
    paymentReceiveId: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const paymentReceive = await this.getPaymentReceiveOrThrowError(
      tenantId,
      paymentReceiveId
    );
    const paymentReceiveInvoicesIds = paymentReceive.entries.map(
      (entry) => entry.invoiceId
    );
    const saleInvoices = await SaleInvoice.query().whereIn(
      'id',
      paymentReceiveInvoicesIds
    );

    return saleInvoices;
  }

  /**
   * Parses payments receive list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve payment receives paginated and filterable list.
   * @param {number} tenantId
   * @param {IPaymentReceivesFilter} paymentReceivesFilter
   */
  public async listPaymentReceives(
    tenantId: number,
    filterDTO: IPaymentReceivesFilter
  ): Promise<{
    paymentReceives: IPaymentReceive[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      PaymentReceive,
      filter
    );
    const { results, pagination } = await PaymentReceive.query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('depositAccount');
        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformer the payment receives models to POJO.
    const transformedPayments = await this.transformer.transform(
      tenantId,
      results,
      new PaymentReceiveTransfromer()
    );
    return {
      paymentReceives: transformedPayments,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Saves difference changing between old and new invoice payment amount.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Array} paymentReceiveEntries
   * @param {Array} newPaymentReceiveEntries
   * @return {Promise<void>}
   */
  public async saveChangeInvoicePaymentAmount(
    tenantId: number,
    newPaymentReceiveEntries: IPaymentReceiveEntryDTO[],
    oldPaymentReceiveEntries?: IPaymentReceiveEntryDTO[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const opers: Promise<void>[] = [];

    const diffEntries = entriesAmountDiff(
      newPaymentReceiveEntries,
      oldPaymentReceiveEntries,
      'paymentAmount',
      'invoiceId'
    );
    diffEntries.forEach((diffEntry: any) => {
      if (diffEntry.paymentAmount === 0) {
        return;
      }
      const oper = SaleInvoice.changePaymentAmount(
        diffEntry.invoiceId,
        diffEntry.paymentAmount,
        trx
      );
      opers.push(oper);
    });
    await Promise.all([...opers]);
  }

  /**
   * Validate the given customer has no payments receives.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoPayments(
    tenantId: number,
    customerId: number
  ) {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceives = await PaymentReceive.query().where(
      'customer_id',
      customerId
    );
    if (paymentReceives.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_PAYMENT_RECEIVES);
    }
  }
}
