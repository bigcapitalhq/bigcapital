import { Inject, Service } from 'typedi';
import { sumBy, difference } from 'lodash';
import {
  IBill,
  IBillPaymentDTO,
  IBillPaymentEntryDTO,
  IBillPayment,
  IBillPaymentEntry,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { ERRORS } from './constants';

@Service()
export class BillPaymentValidators {
  @Inject()
  private tenancy: TenancyService;

  /**
   * Validates the bill payment existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  public async getPaymentMadeOrThrowError(
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
  public async getPaymentAccountOrThrowError(
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
  public async validatePaymentNumber(
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
  public async validateBillsExistance(
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
  public async validateBillsDueAmount(
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
  public async validateEntriesIdsExistance(
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
  public validateVendorNotModified(
    billPaymentDTO: IBillPaymentDTO,
    oldBillPayment: IBillPayment
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
