import { Inject, Service } from 'typedi';
import { difference, sumBy } from 'lodash';
import {
  IAccount,
  IPaymentReceive,
  IPaymentReceiveEditDTO,
  IPaymentReceiveEntry,
  IPaymentReceiveEntryDTO,
  ISaleInvoice,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { PaymentReceive } from '@/models';

@Service()
export class PaymentReceiveValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the payment existance.
   * @param {PaymentReceive | null | undefined} payment
   */
  public validatePaymentExistance(payment: PaymentReceive | null | undefined) {
    if (!payment) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
  }

  /**
   * Validates the payment receive number existance.
   * @param {number} tenantId -
   * @param {string} paymentReceiveNo -
   */
  public async validatePaymentReceiveNoExistance(
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
   * Validates the invoices IDs existance.
   * @param {number} tenantId -
   * @param {number} customerId -
   * @param {IPaymentReceiveEntryDTO[]} paymentReceiveEntries -
   */
  public async validateInvoicesIDsExistance(
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
  public async validateInvoicesPaymentsAmount(
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
   * Validate the payment receive number require.
   * @param {IPaymentReceive} paymentReceiveObj
   */
  public validatePaymentReceiveNoRequire(paymentReceiveObj: IPaymentReceive) {
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
  public async validateEntriesIdsExistance(
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
  public validatePaymentNoRequire(paymentReceiveNo: string) {
    if (!paymentReceiveNo) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NO_REQUIRED);
    }
  }

  /**
   * Validate the payment customer whether modified.
   * @param {IPaymentReceiveEditDTO} paymentReceiveDTO
   * @param {IPaymentReceive} oldPaymentReceive
   */
  public validateCustomerNotModified(
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    oldPaymentReceive: IPaymentReceive
  ) {
    if (paymentReceiveDTO.customerId !== oldPaymentReceive.customerId) {
      throw new ServiceError(ERRORS.PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE);
    }
  }

  /**
   * Validates the payment account currency code. The deposit account curreny
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
    // Detarmines whether the account is cash, bank or other current asset.
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
