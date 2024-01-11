import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { SaleInvoice } from '@/models';
import { ERRORS } from './constants';

@Service()
export class CommandSaleInvoiceValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the given invoice is existance.
   * @param {SaleInvoice | undefined} invoice
   */
  public validateInvoiceExistance(invoice: SaleInvoice | undefined) {
    if (!invoice) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_FOUND);
    }
  }

  /**
   * Validate whether sale invoice number unqiue on the storage.
   * @param {number} tenantId -
   * @param {string} invoiceNumber -
   * @param {number} notInvoiceId -
   */
  public async validateInvoiceNumberUnique(
    tenantId: number,
    invoiceNumber: string,
    notInvoiceId?: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findOne('invoice_no', invoiceNumber)
      .onBuild((builder) => {
        if (notInvoiceId) {
          builder.whereNot('id', notInvoiceId);
        }
      });

    if (saleInvoice) {
      throw new ServiceError(ERRORS.INVOICE_NUMBER_NOT_UNIQUE);
    }
  }

  /**
   * Validate the invoice amount is bigger than payment amount before edit the invoice.
   * @param {number} saleInvoiceAmount
   * @param {number} paymentAmount
   */
  public validateInvoiceAmountBiggerPaymentAmount(
    saleInvoiceAmount: number,
    paymentAmount: number
  ) {
    if (saleInvoiceAmount < paymentAmount) {
      throw new ServiceError(ERRORS.INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT);
    }
  }

  /**
   * Validate the invoice number require.
   * @param {ISaleInvoice} saleInvoiceObj
   */
  public validateInvoiceNoRequire(invoiceNo: string) {
    if (!invoiceNo) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NO_IS_REQUIRED);
    }
  }

  /**
   * Validate the given customer has no sales invoices.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoInvoices(
    tenantId: number,
    customerId: number
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoices = await SaleInvoice.query().where('customer_id', customerId);

    if (invoices.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_INVOICES);
    }
  }
}
