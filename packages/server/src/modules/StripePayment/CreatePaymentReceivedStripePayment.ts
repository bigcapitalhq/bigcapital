import { Knex } from 'knex';
import { GetSaleInvoice } from '../SaleInvoices/queries/GetSaleInvoice.service';
import { CreatePaymentReceivedService } from '../PaymentReceived/commands/CreatePaymentReceived.serivce';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../Accounts/repositories/Account.repository';

@Injectable()
export class CreatePaymentReceiveStripePayment {
  constructor(
    private readonly getSaleInvoiceService: GetSaleInvoice,
    private readonly createPaymentReceivedService: CreatePaymentReceivedService,
    private readonly uow: UnitOfWork,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * Creates a payment received transaction associated to the given invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {number} paidAmount - Paid amount.
   */
  async createPaymentReceived(saleInvoiceId: number, paidAmount: number) {
    // Create a payment received transaction under UOW envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Finds or creates a new stripe payment clearing account (current asset).
      const stripeClearingAccount =
        await this.accountRepository.findOrCreateStripeClearing({}, trx);

      // Retrieves the given invoice to create payment transaction associated to it.
      const invoice =
        await this.getSaleInvoiceService.getSaleInvoice(saleInvoiceId, trx);

      const paymentReceivedDTO = {
        customerId: invoice.customerId,
        paymentDate: new Date(),
        amount: paidAmount,
        exchangeRate: 1,
        referenceNo: '',
        statement: '',
        depositAccountId: stripeClearingAccount.id,
        branchId: invoice.branchId,
        entries: [{ invoiceId: saleInvoiceId, paymentAmount: paidAmount }],
      };
      // Create a payment received transaction associated to the given invoice.
      await this.createPaymentReceivedService.createPaymentReceived(
        paymentReceivedDTO,
        trx,
      );
    });
  }
}
