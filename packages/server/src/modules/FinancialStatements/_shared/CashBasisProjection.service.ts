// @ts-nocheck
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as moment from 'moment';
import { PaymentReceived } from '@/modules/PaymentReceived/models/PaymentReceived';
import { BillPayment } from '@/modules/BillPayments/models/BillPayment';
import { RefundCreditNote } from '@/modules/CreditNoteRefunds/models/RefundCreditNote';
import { RefundVendorCredit } from '@/modules/VendorCreditsRefund/models/RefundVendorCredit';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import {
  aggregateByAccount,
  aggregateByAccountAndPeriod,
  projectInvoice,
  projectBill,
  projectCreditNote,
  projectVendorCredit,
  PERIOD_FORMAT,
  type AggregatedRow,
  type AggregatedPeriodRow,
  type SyntheticRow,
} from './CashBasisProjection.helpers';

/**
 * Synthesizes payment-driven revenue / expense GL rows for cash-basis
 * financial reports.
 *
 * Why this exists: `PaymentReceive` GL only moves cash ↔ AR (and `BillPayment`
 * cash ↔ AP); neither touches revenue or expense accounts. The accrual GL on
 * the invoice / bill is the only place those accounts are debited or credited,
 * and on cash basis we have to exclude those rows. To avoid making cash-basis
 * revenue identically zero, we project synthetic GL rows at each payment /
 * refund date, prorated against the originating document's line items.
 *
 * Returns rows aggregated by `accountId` (and optionally by period) so callers
 * can union the result with the existing direct-cash-movement aggregates and
 * sum on top.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class CashBasisProjection {
  @Inject(PaymentReceived.name)
  paymentReceivedModel!: TenantModelProxy<typeof PaymentReceived>;

  @Inject(BillPayment.name)
  billPaymentModel!: TenantModelProxy<typeof BillPayment>;

  @Inject(RefundCreditNote.name)
  refundCreditNoteModel!: TenantModelProxy<typeof RefundCreditNote>;

  @Inject(RefundVendorCredit.name)
  refundVendorCreditModel!: TenantModelProxy<typeof RefundVendorCredit>;

  public aggregateTotals = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<AggregatedRow[]> => {
    const rows = await this.collectSyntheticRows(fromDate, toDate, branchesIds);
    return aggregateByAccount(rows);
  };

  public aggregatePeriods = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds: number[] | undefined,
    datePeriodsType: keyof typeof PERIOD_FORMAT,
  ): Promise<AggregatedPeriodRow[]> => {
    const rows = await this.collectSyntheticRows(fromDate, toDate, branchesIds);
    const format = PERIOD_FORMAT[datePeriodsType] ?? PERIOD_FORMAT.month;
    return aggregateByAccountAndPeriod(rows, format);
  };

  private collectSyntheticRows = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<SyntheticRow[]> => {
    const [pr, bp, rcn, rvc] = await Promise.all([
      this.fromPaymentReceives(fromDate, toDate, branchesIds),
      this.fromBillPayments(fromDate, toDate, branchesIds),
      this.fromRefundCreditNotes(fromDate, toDate, branchesIds),
      this.fromRefundVendorCredits(fromDate, toDate, branchesIds),
    ]);
    return [...pr, ...bp, ...rcn, ...rvc];
  };

  private fromPaymentReceives = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<SyntheticRow[]> => {
    const from = moment(fromDate).format('YYYY-MM-DD');
    const to = moment(toDate).format('YYYY-MM-DD');
    const payments = await this.paymentReceivedModel()
      .query()
      .where('paymentDate', '>=', from)
      .where('paymentDate', '<=', to)
      .modify((q) => {
        if (branchesIds && branchesIds.length) {
          q.whereIn('branchId', branchesIds);
        }
      })
      .withGraphFetched('entries.invoice.entries');

    const rows: SyntheticRow[] = [];
    for (const payment of payments) {
      const date = moment(payment.paymentDate).format('YYYY-MM-DD');
      for (const entry of payment.entries || []) {
        if (!entry.invoice) continue;
        rows.push(
          ...projectInvoice(
            entry.invoice,
            entry.paymentAmount,
            date,
            payment.branchId ?? entry.invoice.branchId ?? null,
          ),
        );
      }
    }
    return rows;
  };

  private fromBillPayments = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<SyntheticRow[]> => {
    const from = moment(fromDate).format('YYYY-MM-DD');
    const to = moment(toDate).format('YYYY-MM-DD');
    const payments = await this.billPaymentModel()
      .query()
      .where('paymentDate', '>=', from)
      .where('paymentDate', '<=', to)
      .modify((q) => {
        if (branchesIds && branchesIds.length) {
          q.whereIn('branchId', branchesIds);
        }
      })
      .withGraphFetched('entries.bill.entries.item');

    const rows: SyntheticRow[] = [];
    for (const payment of payments) {
      const date = moment(payment.paymentDate).format('YYYY-MM-DD');
      for (const entry of payment.entries || []) {
        if (!entry.bill) continue;
        rows.push(
          ...projectBill(
            entry.bill,
            entry.paymentAmount,
            date,
            payment.branchId ?? entry.bill.branchId ?? null,
          ),
        );
      }
    }
    return rows;
  };

  private fromRefundCreditNotes = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<SyntheticRow[]> => {
    const from = moment(fromDate).format('YYYY-MM-DD');
    const to = moment(toDate).format('YYYY-MM-DD');
    const refunds = await this.refundCreditNoteModel()
      .query()
      .where('date', '>=', from)
      .where('date', '<=', to)
      .modify((q) => {
        if (branchesIds && branchesIds.length) {
          q.whereIn('branchId', branchesIds);
        }
      })
      .withGraphFetched('creditNote.entries');

    const rows: SyntheticRow[] = [];
    for (const refund of refunds) {
      if (!refund.creditNote) continue;
      const date = moment(refund.date).format('YYYY-MM-DD');
      rows.push(
        ...projectCreditNote(
          refund.creditNote,
          refund.amount,
          date,
          refund.branchId ?? refund.creditNote.branchId ?? null,
        ),
      );
    }
    return rows;
  };

  private fromRefundVendorCredits = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    branchesIds?: number[],
  ): Promise<SyntheticRow[]> => {
    const from = moment(fromDate).format('YYYY-MM-DD');
    const to = moment(toDate).format('YYYY-MM-DD');
    const refunds = await this.refundVendorCreditModel()
      .query()
      .where('date', '>=', from)
      .where('date', '<=', to)
      .modify((q) => {
        if (branchesIds && branchesIds.length) {
          q.whereIn('branchId', branchesIds);
        }
      })
      .withGraphFetched('vendorCredit.entries.item');

    const rows: SyntheticRow[] = [];
    for (const refund of refunds) {
      if (!refund.vendorCredit) continue;
      const date = moment(refund.date).format('YYYY-MM-DD');
      rows.push(
        ...projectVendorCredit(
          refund.vendorCredit,
          refund.amount,
          date,
          refund.branchId ?? refund.vendorCredit.branchId ?? null,
        ),
      );
    }
    return rows;
  };
}
