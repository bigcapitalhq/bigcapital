import { Inject, Injectable } from '@nestjs/common';
import { difference, sumBy } from 'lodash';
import {
  IPaymentReceivedEditDTO,
  IPaymentReceivedEntryDTO,
} from '../types/PaymentReceived.types';
import { ERRORS } from '../constants';
import { PaymentReceived } from '../models/PaymentReceived';
import { PaymentReceivedEntry } from '../models/PaymentReceivedEntry';
import { Account } from '@/modules/Accounts/models/Account.model';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditPaymentReceivedDto } from '../dtos/PaymentReceived.dto';

@Injectable()
export class PaymentReceivedValidators {
  constructor(
    @Inject(PaymentReceived.name)
    private readonly paymentReceiveModel: TenantModelProxy<
      typeof PaymentReceived
    >,

    @Inject(PaymentReceivedEntry.name)
    private readonly paymentReceiveEntryModel: TenantModelProxy<
      typeof PaymentReceivedEntry
    >,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) { }

  /**
   * Validates the payment existance.
   * @param {PaymentReceive | null | undefined} payment
   */
  public validatePaymentExistance(payment: PaymentReceived | null | undefined) {
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
    paymentReceiveNo: string,
    notPaymentReceiveId?: number,
  ): Promise<void> {
    const paymentReceive = await this.paymentReceiveModel()
      .query()
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
   * @param {number} customerId -
   * @param {IPaymentReceivedEntryDTO[]} paymentReceiveEntries -
   */
  public async validateInvoicesIDsExistance(
    customerId: number,
    paymentReceiveEntries: { invoiceId: number }[],
  ): Promise<SaleInvoice[]> {
    const invoicesIds = paymentReceiveEntries
      .map((e: { invoiceId: number }) => e.invoiceId)
      .filter((id): id is number => id !== undefined && id !== null);

    if (invoicesIds.length === 0) {
      throw new ServiceError(ERRORS.INVOICES_IDS_NOT_FOUND);
    }

    const storedInvoices = await this.saleInvoiceModel()
      .query()
      .whereIn('id', invoicesIds)
      .where('customer_id', customerId);

    const storedInvoicesIds = storedInvoices.map((invoice) => invoice.id);
    const notFoundInvoicesIDs = difference(invoicesIds, storedInvoicesIds);

    if (notFoundInvoicesIDs.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_IDS_NOT_FOUND);
    }
    // Filters the not delivered invoices.
    const notDeliveredInvoices = storedInvoices.filter(
      (invoice) => !invoice.isDelivered,
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
   * @param {IPaymentReceivedEntryDTO[]} paymentReceiveEntries
   * @param {IPaymentReceivedEntry[]} oldPaymentEntries
   */
  public async validateInvoicesPaymentsAmount(
    paymentReceiveEntries: IPaymentReceivedEntryDTO[],
    oldPaymentEntries: PaymentReceivedEntry[] = [],
  ) {
    const invoicesIds = paymentReceiveEntries.map(
      (e: IPaymentReceivedEntryDTO) => e.invoiceId,
    );
    const storedInvoices = await this.saleInvoiceModel()
      .query()
      .whereIn('id', invoicesIds);

    const storedInvoicesMap = new Map(
      storedInvoices.map((invoice: SaleInvoice) => {
        const oldEntries = oldPaymentEntries.filter((entry) => entry.invoiceId);
        const oldPaymentAmount = sumBy(oldEntries, 'paymentAmount') || 0;

        return [
          invoice.id,
          { ...invoice, dueAmount: invoice.dueAmount + oldPaymentAmount },
        ];
      }),
    );
    const hasWrongPaymentAmount: any[] = [];

    paymentReceiveEntries.forEach(
      (entry: IPaymentReceivedEntryDTO, index: number) => {
        const entryInvoice = storedInvoicesMap.get(entry.invoiceId);
        const { dueAmount } = entryInvoice;

        if (dueAmount < entry.paymentAmount) {
          hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
        }
      },
    );
    if (hasWrongPaymentAmount.length > 0) {
      throw new ServiceError(ERRORS.INVALID_PAYMENT_AMOUNT);
    }
  }

  /**
   * Validate the payment receive number require.
   * @param {IPaymentReceived} paymentReceiveObj
   */
  public validatePaymentReceiveNoRequire(paymentReceiveObj: PaymentReceived) {
    if (!paymentReceiveObj.paymentReceiveNo) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the payment receive entries IDs existance.
   * @param {number} paymentReceiveId
   * @param {IPaymentReceivedEntryDTO[]} paymentReceiveEntries
   */
  public async validateEntriesIdsExistance(
    paymentReceiveId: number,
    paymentReceiveEntries: IPaymentReceivedEntryDTO[],
  ) {
    const entriesIds = paymentReceiveEntries
      .filter((entry) => entry.id)
      .map((entry) => entry.id);

    const storedEntries = await this.paymentReceiveEntryModel()
      .query()
      .where('payment_receive_id', paymentReceiveId);
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
   * @param {EditPaymentReceivedDto} paymentReceiveDTO
   * @param {PaymentReceived} oldPaymentReceive
   */
  public validateCustomerNotModified(
    paymentReceiveDTO: EditPaymentReceivedDto,
    oldPaymentReceive: PaymentReceived,
  ) {
    if (paymentReceiveDTO.customerId !== oldPaymentReceive.customerId) {
      throw new ServiceError(ERRORS.PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE);
    }
  }

  /**
   * Validates the payment account currency code. The deposit account curreny
   * should be equals the customer currency code or the base currency.
   * @param {string} paymentAccountCurrency
   * @param {string} customerCurrency
   * @param {string} baseCurrency
   * @throws {ServiceError(ERRORS.PAYMENT_ACCOUNT_CURRENCY_INVALID)}
   */
  public validatePaymentAccountCurrency = (
    paymentAccountCurrency: string,
    customerCurrency: string,
    baseCurrency: string,
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
   * @param {number} paymentReceiveId - Payment receive id.
   */
  async getPaymentReceiveOrThrowError(
    paymentReceiveId: number,
  ): Promise<PaymentReceived> {
    const paymentReceive = await this.paymentReceiveModel()
      .query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId);

    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    return paymentReceive;
  }

  /**
   * Validate the deposit account id existance.
   * @param {number} depositAccountId - Deposit account id.
   * @return {Promise<IAccount>}
   */
  async getDepositAccountOrThrowError(
    depositAccountId: number,
  ): Promise<Account> {
    const depositAccount = await this.accountModel()
      .query()
      .findById(depositAccountId);

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
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoPayments(customerId: number) {
    const paymentReceives = await this.paymentReceiveModel()
      .query()
      .where('customer_id', customerId);
    if (paymentReceives.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_PAYMENT_RECEIVES);
    }
  }
}
