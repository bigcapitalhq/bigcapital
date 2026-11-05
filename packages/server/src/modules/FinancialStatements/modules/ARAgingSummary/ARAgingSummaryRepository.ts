import { Inject, Injectable, Scope } from '@nestjs/common';
import { isEmpty, groupBy } from 'lodash';
import { Customer } from '@/modules/Customers/models/Customer';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { PaymentReceivedEntry } from '@/modules/PaymentReceived/models/PaymentReceivedEntry';
import { CreditNoteAppliedInvoice } from '@/modules/CreditNotesApplyInvoice/models/CreditNoteAppliedInvoice';
import { ModelObject } from 'objection';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';
import {
  AgingSettlementRow,
  getAgingDocumentsAsOf,
  IAgingDocument,
  toDateKey,
  writeoffSettlementRows,
} from '../AgingSummary/AgingAsOf';

@Injectable({ scope: Scope.REQUEST })
export class ARAgingSummaryRepository {
  @Inject(TenancyContext)
  private tenancyContext: TenancyContext;

  @Inject(Customer.name)
  private customerModel: TenantModelProxy<typeof Customer>;

  @Inject(SaleInvoice.name)
  private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>;

  @Inject(PaymentReceivedEntry.name)
  private paymentReceivedEntryModel: TenantModelProxy<
    typeof PaymentReceivedEntry
  >;

  @Inject(CreditNoteAppliedInvoice.name)
  private creditNoteAppliedInvoiceModel: TenantModelProxy<
    typeof CreditNoteAppliedInvoice
  >;

  /**
   * Filter.
   * @param {ARAgingSummaryQueryDto} filter
   */
  filter: ARAgingSummaryQueryDto;

  /**
   * Base currency.
   * @param {string} baseCurrency
   */
  baseCurrency: string;

  /**
   * Customers.
   * @param {ModelObject<Customer>[]} customers
   */
  customers: ModelObject<Customer>[];

  /**
   * Invoices that are open and not yet due on the as-of date, by customer id.
   * @param {Record<string, IAgingDocument[]>} currentInvoicesByContactId
   */
  currentInvoicesByContactId: Record<string, IAgingDocument[]>;

  /**
   * Invoices that are open and overdue on the as-of date, by customer id.
   * @param {Record<string, IAgingDocument[]>} overdueInvoicesByContactId
   */
  overdueInvoicesByContactId: Record<string, IAgingDocument[]>;

  /**
   * Set the filter.
   * @param {ARAgingSummaryQueryDto} filter
   */
  setFilter(filter: ARAgingSummaryQueryDto) {
    this.filter = filter;
  }

  /**
   * Initialize the repository.
   */
  async load() {
    await this.initBaseCurrency();
    await this.initCustomers();
    await this.initAgingInvoices();
  }

  /**
   * Initialize the base currency.
   */
  async initBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Initialize the customers.
   */
  async initCustomers() {
    // Retrieve all customers from the storage.
    const customers =
      this.filter.customersIds.length > 0
        ? await this.customerModel()
            .query()
            .whereIn('id', this.filter.customersIds)
        : await this.customerModel().query();

    this.customers = customers;
  }

  /**
   * Initialize the invoices open on the as-of date, split into current and
   * overdue ones. Only payments, credit notes and write-offs dated on or
   * before the as-of date reduce an invoice's open amount.
   */
  async initAgingInvoices() {
    const asDate = toDateKey(this.filter.asDate);

    const invoices = await this.saleInvoiceModel()
      .query()
      .modify('agingCandidatesAsOf', asDate)
      .onBuild((query) => {
        if (!isEmpty(this.filter.branchesIds)) {
          query.modify('filterByBranches', this.filter.branchesIds);
        }
        if (!isEmpty(this.filter.customersIds)) {
          query.whereIn('customerId', this.filter.customersIds);
        }
      });
    const settlements = await this.getInvoicesSettlements(
      invoices.map((invoice) => invoice.id),
    );
    const { current, overdue } = getAgingDocumentsAsOf(
      invoices.map((invoice) => ({
        id: invoice.id,
        contactId: invoice.customerId,
        total: invoice.total,
        exchangeRate: invoice.exchangeRate,
        documentDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
      })),
      [...settlements, ...writeoffSettlementRows(invoices)],
      asDate,
    );
    this.currentInvoicesByContactId = groupBy(current, 'contactId');
    this.overdueInvoicesByContactId = groupBy(overdue, 'contactId');
  }

  /**
   * Retrieves the payments and applied credit notes of the given invoices,
   * each dated on the payment date or the credit note date.
   * @param {number[]} invoicesIds
   * @returns {Promise<AgingSettlementRow[]>}
   */
  private async getInvoicesSettlements(
    invoicesIds: number[],
  ): Promise<AgingSettlementRow[]> {
    if (isEmpty(invoicesIds)) return [];

    const payments = await this.paymentReceivedEntryModel()
      .query()
      .join(
        'payment_receives',
        'payment_receives.id',
        'payment_receives_entries.payment_receive_id',
      )
      .whereIn('payment_receives_entries.invoice_id', invoicesIds)
      .select(
        'payment_receives_entries.invoice_id',
        'payment_receives_entries.payment_amount',
        'payment_receives.payment_date',
      );
    const credits = await this.creditNoteAppliedInvoiceModel()
      .query()
      .join(
        'credit_notes',
        'credit_notes.id',
        'credit_note_applied_invoice.credit_note_id',
      )
      .whereIn('credit_note_applied_invoice.invoice_id', invoicesIds)
      .select(
        'credit_note_applied_invoice.invoice_id',
        'credit_note_applied_invoice.amount',
        'credit_notes.credit_note_date',
      );

    return [
      ...payments.map((payment: any) => ({
        documentId: payment.invoiceId,
        amount: Number(payment.paymentAmount),
        date: payment.paymentDate,
      })),
      ...credits.map((credit: any) => ({
        documentId: credit.invoiceId,
        amount: Number(credit.amount),
        date: credit.creditNoteDate,
      })),
    ];
  }
}
