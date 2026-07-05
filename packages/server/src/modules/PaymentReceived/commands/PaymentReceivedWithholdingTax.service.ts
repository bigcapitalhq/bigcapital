import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentReceivedService } from './CreatePaymentReceived.serivce';
import { DeletePaymentReceivedService } from './DeletePaymentReceived.service';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Customer } from '@/modules/Customers/models/Customer';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { PaymentReceived } from '../models/PaymentReceived';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreatePaymentReceivedDto } from '../dtos/PaymentReceived.dto';
import { computeWithholdingSettlement } from '../withholding.utils';

/** Reference prefix linking a companion withholding payment to its origin. */
export const WITHHOLDING_PAYMENT_REF_PREFIX = 'WHT-';

/**
 * Books withholding tax withheld by payers (e.g. NZ schedular payments).
 *
 * When a customer has a withholding tax rate and a received payment settles
 * an invoice net of that withholding, a companion payment is created into
 * the "Withholding Tax Receivable" asset account for the withheld portion,
 * so the invoice settles in full and the withheld tax is tracked as a
 * claimable asset (Dr Withholding Tax Receivable / Cr Accounts Receivable).
 */
@Injectable()
export class PaymentReceivedWithholdingTax {
  constructor(
    private readonly createPaymentReceivedService: CreatePaymentReceivedService,
    private readonly deletePaymentReceivedService: DeletePaymentReceivedService,
    private readonly accountRepository: AccountRepository,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Creates the companion withholding payment when the given payment
   * settles its invoices net of the customer's withholding tax.
   * @param {number} paymentReceiveId - The origin payment id.
   * @param {CreatePaymentReceivedDto} paymentReceiveDTO - The origin payment DTO.
   * @param {Knex.Transaction} trx
   */
  public async createWithheldPaymentIfApplies(
    paymentReceiveId: number,
    paymentReceiveDTO: CreatePaymentReceivedDto,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const customer = await this.customerModel()
      .query(trx)
      .findById(paymentReceiveDTO.customerId);

    const withholdingTaxRate = Number(customer?.withholdingTaxRate) || 0;
    if (withholdingTaxRate <= 0) return;

    const withholdingAccount =
      await this.accountRepository.findOrCreateWithholdingTaxReceivable(
        {},
        trx,
      );
    // Guards against recursion once the companion payment is created.
    if (paymentReceiveDTO.depositAccountId === withholdingAccount.id) return;

    const withheldEntries = [];

    for (const entry of paymentReceiveDTO.entries || []) {
      const invoice = await this.saleInvoiceModel()
        .query(trx)
        .findById(entry.invoiceId);
      if (!invoice) continue;

      const settlement = computeWithholdingSettlement({
        total: invoice.total,
        subtotalExcludingTax: invoice.subtotalExludingTax,
        paymentAmount: Number(entry.paymentAmount),
        withholdingTaxRate,
      });
      if (settlement.applies) {
        withheldEntries.push({
          index: withheldEntries.length + 1,
          invoiceId: entry.invoiceId,
          paymentAmount: settlement.withheldAmount,
        });
      }
    }
    if (withheldEntries.length === 0) return;

    await this.createPaymentReceivedService.createPaymentReceived(
      {
        customerId: paymentReceiveDTO.customerId,
        paymentDate: paymentReceiveDTO.paymentDate,
        depositAccountId: withholdingAccount.id,
        referenceNo: `${WITHHOLDING_PAYMENT_REF_PREFIX}${paymentReceiveId}`,
        statement: 'Withholding tax withheld by payer (auto)',
        branchId: paymentReceiveDTO.branchId,
        entries: withheldEntries,
      } as CreatePaymentReceivedDto,
      trx,
    );
  }

  /**
   * Deletes the companion withholding payment(s) of the given origin
   * payment, if any.
   * @param {number} paymentReceiveId - The origin payment id.
   * @param {Knex.Transaction} trx
   */
  public async deleteWithheldPaymentIfExists(
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const companions = await this.paymentReceivedModel()
      .query(trx)
      .where(
        'reference_no',
        `${WITHHOLDING_PAYMENT_REF_PREFIX}${paymentReceiveId}`,
      );

    for (const companion of companions) {
      await this.deletePaymentReceivedService.deletePaymentReceive(
        companion.id,
        trx,
      );
    }
  }
}
