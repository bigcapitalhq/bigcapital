import Bluebird from 'bluebird';
import { Inject, Service } from 'typedi';
import HasTenancyService from 'services/Tenancy/TenancyService';
import { TimeoutSettings } from 'puppeteer';

@Service()
export default class OrganizationBaseCurrencyLocking {
  @Inject()
  tenancy: HasTenancyService;

  async shouldHasAlteastOne(Model) {
    const model = await Model.query().limit(1);
    return model.length > 0;
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validateInvoiceTransaction(tenantId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(SaleInvoice);
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validateEstimateTransaction(tenantId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(SaleEstimate);
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validateReceiptTransaction(tenantId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(SaleReceipt);
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validatePaymentReceiveTransaction(tenantId: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(PaymentReceive);
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validatePaymentMadeTransaction(tenantId: number) {
    const { BillPayment } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(BillPayment);
  }

  /**
   * Validate the invoice has atleast once transaction.
   * @param tenantId
   */
  async validateBillTransaction(tenantId: number) {
    const { Bill } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(Bill);
  }

  async validateJournalTransaction(tenantId: number) {
    const { ManualJournal } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(ManualJournal);
  }

  async validateAccountTransaction(tenantId: number) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    return this.shouldHasAlteastOne(AccountTransaction);
  }

  /**
   *
   * @param serviceName
   * @param callback
   * @returns
   */
  validateService(serviceName, callback) {
    return callback.then((result) => (result ? serviceName : false));
  }

  getValidators(tenantId: number) {
    return [
      {
        serviceName: 'invoice',
        validator: this.validateInvoiceTransaction(tenantId),
      },
      {
        serviceName: 'receipt',
        validator: this.validateReceiptTransaction(tenantId),
      },
      {
        serviceName: 'bill',
        validator: this.validateBillTransaction(tenantId),
      },
      {
        serviceName: 'estimate',
        validator: this.validateEstimateTransaction(tenantId),
      },
      {
        serviceName: 'payment-receive',
        validator: this.validatePaymentReceiveTransaction(tenantId),
      },
      {
        serviceName: 'payment-made',
        validator: this.validatePaymentMadeTransaction(tenantId),
      },
      {
        serviceName: 'manual-journal',
        validator: this.validateJournalTransaction(tenantId),
      },
      {
        service: 'transaction',
        validator: this.validateAccountTransaction(tenantId),
      },
    ];
  }

  /**
   *
   * @param tenantId
   * @returns
   */
  async isBaseCurrencyMutateLocked(tenantId: number): Promise<string[]> {
    const validators = this.getValidators(tenantId);

    const asyncValidators = validators.map((validator) =>
      this.validateService(validator.serviceName, validator.validator)
    );
    const results = await Bluebird.all(asyncValidators);

    return results.filter((result) => result);
  }
}
