import * as moment from 'moment';
import { ARAgingSummarySheet } from '../ARAgingSummary/ARAgingSummarySheet';
import { APAgingSummarySheet } from '../APAgingSummary/APAgingSummarySheet';
import { ARAgingSummaryRepository } from '../ARAgingSummary/ARAgingSummaryRepository';
import { APAgingSummaryRepository } from '../APAgingSummary/APAgingSummaryRepository';
import { ARAgingSummaryQueryDto } from '../ARAgingSummary/ARAgingSummaryQuery.dto';
import { APAgingSummaryQueryDto } from '../APAgingSummary/APAgingSummaryQuery.dto';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { Bill } from '@/modules/Bills/models/Bill';

const numberFormat = {
  precision: 2,
  divideOn1000: false,
  showZero: false,
  formatMoney: 'always',
  negativeFormat: 'mines',
};

const baseQuery = {
  asDate: '2026-01-01',
  agingDaysBefore: 30,
  agingPeriods: 3,
  numberFormat,
  branchesIds: [],
  noneZero: false,
};

const baseMeta = {
  baseCurrency: 'USD',
  dateFormat: 'YYYY MMM DD',
};

const saleInvoice = (data: Record<string, any>) =>
  SaleInvoice.fromJson({
    paymentAmount: 0,
    writtenoffAmount: 0,
    creditedAmount: 0,
    discount: 0,
    ...data,
  });

const bill = (data: Record<string, any>) =>
  Bill.fromJson({
    paymentAmount: 0,
    creditedAmount: 0,
    discount: 0,
    ...data,
  });

describe('AgingSummary', () => {
  describe('A/R aging summary', () => {
    const repository = {
      customers: [
        { id: 1, displayName: 'Customer A' },
        { id: 2, displayName: 'Customer B' },
      ],
      overdueInvoicesByContactId: {
        1: [
          saleInvoice({
            balance: 100,
            exchangeRate: 1.5,
            dueDate: moment().subtract(10, 'days').toDate(),
          }),
        ],
        2: [
          saleInvoice({
            balance: 70,
            exchangeRate: 1,
            dueDate: moment().subtract(5, 'days').toDate(),
          }),
        ],
      },
      currentInvoicesByContactId: {
        1: [
          saleInvoice({ balance: 40, exchangeRate: 1.5 }),
          saleInvoice({ balance: 25, exchangeRate: null }),
        ],
      },
    } as unknown as ARAgingSummaryRepository;

    const report = () =>
      new ARAgingSummarySheet(
        { ...baseQuery, customersIds: [] } as unknown as ARAgingSummaryQueryDto,
        repository,
        baseMeta,
      ).reportData();

    it('converts the foreign currency due amounts into the base currency', () => {
      const { customers } = report();
      const customerA = customers.find(
        (customer) => customer.customerName === 'Customer A',
      );

      expect(customerA.current.amount).toBe(85);
      expect(customerA.aging[0].total.amount).toBe(150);
      expect(customerA.total.amount).toBe(235);
      expect(customerA.current.currencyCode).toBe('USD');
    });

    it('keeps the base currency due amounts unchanged', () => {
      const { customers } = report();
      const customerB = customers.find(
        (customer) => customer.customerName === 'Customer B',
      );

      expect(customerB.aging[0].total.amount).toBe(70);
      expect(customerB.total.amount).toBe(70);
    });

    it('computes the report total in the base currency', () => {
      const { total } = report();

      expect(total.current.amount).toBe(85);
      expect(total.aging[0].total.amount).toBe(220);
      expect(total.total.amount).toBe(305);
      expect(total.total.currencyCode).toBe('USD');
    });
  });

  describe('A/P aging summary', () => {
    const repository = {
      vendors: [{ id: 1, displayName: 'Vendor A' }],
      overdueBillsByVendorId: {
        1: [
          bill({
            amount: 200,
            exchangeRate: 0.8,
            dueDate: moment().subtract(45, 'days').toDate(),
          }),
        ],
      },
      dueBillsByVendorId: {
        1: [bill({ amount: 50, exchangeRate: 0.8 })],
      },
    } as unknown as APAgingSummaryRepository;

    const report = () =>
      new APAgingSummarySheet(
        { ...baseQuery, vendorsIds: [] } as unknown as APAgingSummaryQueryDto,
        repository,
        baseMeta,
      ).reportData();

    it('converts the foreign currency due amounts into the base currency', () => {
      const { vendors, total } = report();
      const vendorA = vendors.find(
        (vendor) => vendor.vendorName === 'Vendor A',
      );

      expect(vendorA.current.amount).toBe(40);
      expect(vendorA.aging[1].total.amount).toBe(160);
      expect(vendorA.total.amount).toBe(200);
      expect(total.total.amount).toBe(200);
      expect(total.total.currencyCode).toBe('USD');
    });
  });
});
