import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { SaleReceipt } from '../models/SaleReceipt';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ACCOUNT_PARENT_TYPE } from '@/constants/accounts';

@Injectable()
export class SaleReceiptValidators {
  /**
   * @param {typeof SaleReceipt} saleReceiptModel - Sale receipt model.
   * @param {typeof Account} accountModel - Account model.
   */
  constructor(
    @Inject(SaleReceipt.name) private saleReceiptModel: typeof SaleReceipt,
    @Inject(Account.name) private accountModel: typeof Account,
  ) {}

  /**
   * Validates the sale receipt existence.
   * @param {SaleEstimate | undefined | null} estimate
   */
  public validateReceiptExistence(receipt: SaleReceipt | undefined | null) {
    if (!receipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
  }

  /**
   * Validates the receipt not closed.
   * @param {SaleReceipt} receipt
   */
  public validateReceiptNotClosed(receipt: SaleReceipt) {
    if (receipt.isClosed) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_IS_ALREADY_CLOSED);
    }
  }

  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {number} accountId - Account id.
   */
  public async validateReceiptDepositAccountExistence(accountId: number) {
    const depositAccount = await this.accountModel.query().findById(accountId);

    if (!depositAccount) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_FOUND);
    }
    if (!depositAccount.isParentType(ACCOUNT_PARENT_TYPE.CURRENT_ASSET)) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET);
    }
  }

  /**
   * Validate sale receipt number uniqueness on the storage.
   * @param {string} receiptNumber -
   * @param {number} notReceiptId -
   */
  public async validateReceiptNumberUnique(
    receiptNumber: string,
    notReceiptId?: number,
  ) {
    const saleReceipt = await this.saleReceiptModel
      .query()
      .findOne('receipt_number', receiptNumber)
      .onBuild((builder) => {
        if (notReceiptId) {
          builder.whereNot('id', notReceiptId);
        }
      });

    if (saleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NUMBER_NOT_UNIQUE);
    }
  }

  /**
   * Validate the sale receipt number require.
   * @param {ISaleReceipt} saleReceipt
   */
  public validateReceiptNoRequire(receiptNumber: string) {
    if (!receiptNumber) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the given customer has no sales receipts.
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoReceipts(customerId: number) {
    const receipts = await this.saleReceiptModel
      .query()
      .where('customer_id', customerId);

    if (receipts.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_INVOICES);
    }
  }
}
