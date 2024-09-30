import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { GetSaleInvoice } from '../Sales/Invoices/GetSaleInvoice';
import { CreatePaymentReceived } from '../Sales/PaymentReceived/CreatePaymentReceived';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';

@Service()
export class CreatePaymentReceiveStripePayment {
  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private createPaymentReceivedService: CreatePaymentReceived;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   *
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {number} paidAmount
   */
  async createPaymentReceived(
    tenantId: number,
    saleInvoiceId: number,
    paidAmount: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Create a payment received transaction under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Finds or creates a new stripe payment clearing account (current asset).
      const stripeClearingAccount =
        await accountRepository.findOrCreateStripeClearing({}, trx);

      // Retrieves the given invoice to create payment transaction associated to it.
      const invoice = await this.getSaleInvoiceService.getSaleInvoice(
        tenantId,
        saleInvoiceId
      );
      const paymentReceivedDTO = {
        customerId: invoice.customerId,
        paymentDate: new Date(),
        amount: paidAmount,
        exchangeRate: 1,
        referenceNo: '',
        statement: '',
        depositAccountId: stripeClearingAccount.id,
        entries: [{ invoiceId: saleInvoiceId, paymentAmount: paidAmount }],
      };
      // Create a payment received transaction associated to the given invoice.
      await this.createPaymentReceivedService.createPaymentReceived(
        tenantId,
        paymentReceivedDTO,
        {},
        trx
      );
    });
  }
}
