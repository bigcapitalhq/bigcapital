import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ACCOUNT_PARENT_TYPE } from '@/data/AccountTypes';
import { ERRORS } from './constants';
import { SaleEstimate, SaleReceipt } from '@/models';

@Service()
export class SaleReceiptValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the sale receipt existance.
   * @param {SaleEstimate | undefined | null} estimate
   */
  public validateReceiptExistance(receipt: SaleReceipt | undefined | null) {
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
   * @param {number} tenantId - Tenant id.
   * @param {number} accountId - Account id.
   */
  public async validateReceiptDepositAccountExistance(
    tenantId: number,
    accountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const depositAccount = await accountRepository.findOneById(accountId);

    if (!depositAccount) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_FOUND);
    }
    if (!depositAccount.isParentType(ACCOUNT_PARENT_TYPE.CURRENT_ASSET)) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET);
    }
  }

  /**
   * Validate sale receipt number uniquiness on the storage.
   * @param {number} tenantId -
   * @param {string} receiptNumber -
   * @param {number} notReceiptId -
   */
  public async validateReceiptNumberUnique(
    tenantId: number,
    receiptNumber: string,
    notReceiptId?: number
  ) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
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
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoReceipts(
    tenantId: number,
    customerId: number
  ) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const receipts = await SaleReceipt.query().where('customer_id', customerId);

    if (receipts.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_INVOICES);
    }
  }
}
