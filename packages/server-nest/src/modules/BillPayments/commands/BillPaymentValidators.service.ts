import { Inject, Injectable } from '@nestjs/common';
import { sumBy, difference } from 'lodash';
import {
  IBillPaymentDTO,
  IBillPaymentEntryDTO,
} from '../types/BillPayments.types';
import { ERRORS } from '../constants';
import { Bill } from '../../Bills/models/Bill';
import { BillPayment } from '../models/BillPayment';
import { BillPaymentEntry } from '../models/BillPaymentEntry';
import { ServiceError } from '../../Items/ServiceError';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '../../Accounts/models/Account.model';

@Injectable()
export class BillPaymentValidators {
  constructor(
    @Inject(Bill.name)
    private readonly billModel: typeof Bill,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: typeof BillPayment,

    @Inject(BillPaymentEntry.name)
    private readonly billPaymentEntryModel: typeof BillPaymentEntry,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,
  ) {}

  /**
   * Validates the bill payment existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  public async getPaymentMadeOrThrowError(paymentMadeId: number) {
    const billPayment = await this.billPaymentModel
      .query()
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
  public async getPaymentAccountOrThrowError(paymentAccountId: number) {
    const paymentAccount = await this.accountModel
      .query()
      .findById(paymentAccountId);
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
  public async validatePaymentNumber(
    paymentMadeNumber: string,
    notPaymentMadeId?: number,
  ) {
    const foundBillPayment = await this.billPaymentModel
      .query()
      .onBuild((builder: any) => {
        builder.findOne('payment_number', paymentMadeNumber);

        if (notPaymentMadeId) {
          builder.whereNot('id', notPaymentMadeId);
        }
      });

    if (foundBillPayment) {
      throw new ServiceError(ERRORS.BILL_PAYMENT_NUMBER_NOT_UNQIUE);
    }
    return foundBillPayment;
  }

  /**
   * Validate whether the entries bills ids exist on the storage.
   */
  public async validateBillsExistance(
    billPaymentEntries: { billId: number }[],
    vendorId: number,
  ) {
    const entriesBillsIds = billPaymentEntries.map((e: any) => e.billId);

    const storedBills = await this.billModel
      .query()
      .whereIn('id', entriesBillsIds)
      .where('vendor_id', vendorId);

    const storedBillsIds = storedBills.map((t: Bill) => t.id);
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
  public async validateBillsDueAmount(
    billPaymentEntries: IBillPaymentEntryDTO[],
    oldPaymentEntries: BillPaymentEntry[] = [],
  ) {
    const billsIds = billPaymentEntries.map(
      (entry: IBillPaymentEntryDTO) => entry.billId,
    );

    const storedBills = await this.billModel.query().whereIn('id', billsIds);
    const storedBillsMap = new Map(
      storedBills.map((bill) => {
        const oldEntries = oldPaymentEntries.filter(
          (entry) => entry.billId === bill.id,
        );
        const oldPaymentAmount = sumBy(oldEntries, 'paymentAmount') || 0;

        return [
          bill.id,
          { ...bill, dueAmount: bill.dueAmount + oldPaymentAmount },
        ];
      }),
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
  public async validateEntriesIdsExistance(
    billPaymentId: number,
    billPaymentEntries: BillPaymentEntry[],
  ) {
    const entriesIds = billPaymentEntries
      .filter((entry: any) => entry.id)
      .map((entry: any) => entry.id);

    const storedEntries = await this.billPaymentEntryModel
      .query()
      .where('bill_payment_id', billPaymentId);

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
  public validateVendorNotModified(
    billPaymentDTO: IBillPaymentDTO,
    oldBillPayment: BillPayment,
  ) {
    if (billPaymentDTO.vendorId !== oldBillPayment.vendorId) {
      throw new ServiceError(ERRORS.PAYMENT_NUMBER_SHOULD_NOT_MODIFY);
    }
  }

  /**
   * Validates the payment account currency code. The deposit account curreny
   * should be equals the customer currency code or the base currency.
   * @param  {string} paymentAccountCurrency
   * @param  {string} customerCurrency
   * @param  {string} baseCurrency
   * @throws {ServiceError(ERRORS.WITHDRAWAL_ACCOUNT_CURRENCY_INVALID)}
   */
  public validateWithdrawalAccountCurrency = (
    paymentAccountCurrency: string,
    customerCurrency: string,
    baseCurrency: string,
  ) => {
    if (
      paymentAccountCurrency !== customerCurrency &&
      paymentAccountCurrency !== baseCurrency
    ) {
      throw new ServiceError(ERRORS.WITHDRAWAL_ACCOUNT_CURRENCY_INVALID);
    }
  };

  /**
   * Validates the given vendor has no associated payments.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public async validateVendorHasNoPayments(vendorId: number) {
    const payments = await this.billPaymentModel
      .query()
      .where('vendor_id', vendorId);

    if (payments.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_PAYMENTS);
    }
  }
}
