import {
  aggregateByAccount,
  aggregateByAccountAndPeriod,
  projectBill,
  projectCreditNote,
  projectInvoice,
  projectVendorCredit,
} from './CashBasisProjection.helpers';

const invoiceFixture = (overrides: any = {}) => ({
  total: 1000,
  exchangeRate: 1,
  entries: [{ sellAccountId: 200, totalExcludingTax: 1000 }],
  ...overrides,
});

const billFixture = (overrides: any = {}) => ({
  total: 500,
  exchangeRate: 1,
  entries: [{ costAccountId: 300, totalExcludingTax: 500 }],
  ...overrides,
});

describe('CashBasisProjection.helpers', () => {
  describe('projectInvoice', () => {
    it('returns no rows when the share is zero (unpaid invoice)', () => {
      const rows = projectInvoice(invoiceFixture(), 0, '2026-02-01', 1);
      expect(rows).toEqual([]);
    });

    it('full payment recognizes the full pre-tax line amount', () => {
      const rows = projectInvoice(invoiceFixture(), 1000, '2026-02-01', 1);
      expect(rows).toEqual([
        {
          accountId: 200,
          credit: 1000,
          debit: 0,
          date: '2026-02-01',
          branchId: 1,
        },
      ]);
    });

    it('30% partial payment recognizes 30% of each line', () => {
      const rows = projectInvoice(invoiceFixture(), 300, '2026-04-15', null);
      expect(rows[0].credit).toBeCloseTo(300, 6);
    });

    it('fans out across multiple revenue lines proportionally', () => {
      const invoice = invoiceFixture({
        total: 1000,
        entries: [
          { sellAccountId: 200, totalExcludingTax: 600 },
          { sellAccountId: 201, totalExcludingTax: 400 },
        ],
      });
      const rows = projectInvoice(invoice, 250, '2026-04-15', 1); // 25% share
      expect(rows).toHaveLength(2);
      expect(rows[0].credit).toBeCloseTo(150, 6);
      expect(rows[1].credit).toBeCloseTo(100, 6);
    });

    it('uses invoice exchangeRate to convert to base currency', () => {
      const invoice = invoiceFixture({ exchangeRate: 1.25 });
      const rows = projectInvoice(invoice, 1000, '2026-02-01', 1);
      expect(rows[0].credit).toBeCloseTo(1250, 6); // 1000 × 1.25 share × 1
    });

    it('skips lines with no sellAccountId', () => {
      const invoice = invoiceFixture({
        entries: [
          { sellAccountId: 200, totalExcludingTax: 500 },
          { sellAccountId: null, totalExcludingTax: 500 },
        ],
      });
      const rows = projectInvoice(invoice, 1000, '2026-02-01', 1);
      expect(rows).toHaveLength(1);
      expect(rows[0].accountId).toBe(200);
    });

    it('safely handles a zero-total invoice', () => {
      const rows = projectInvoice(
        invoiceFixture({ total: 0 }),
        100,
        '2026-02-01',
        1,
      );
      expect(rows).toEqual([]);
    });
  });

  describe('projectBill', () => {
    it('full payment recognizes the full pre-tax expense', () => {
      const rows = projectBill(billFixture(), 500, '2026-02-01', 2);
      expect(rows).toEqual([
        {
          accountId: 300,
          credit: 0,
          debit: 500,
          date: '2026-02-01',
          branchId: 2,
        },
      ]);
    });

    it('inventory line uses item.inventoryAccountId', () => {
      const bill = billFixture({
        entries: [
          {
            costAccountId: 999,
            totalExcludingTax: 500,
            item: { type: 'inventory', inventoryAccountId: 350 },
          },
        ],
      });
      const rows = projectBill(bill, 500, '2026-02-01', 2);
      expect(rows[0].accountId).toBe(350);
    });

    it('non-inventory line falls back to costAccountId', () => {
      const bill = billFixture({
        entries: [
          {
            costAccountId: 300,
            totalExcludingTax: 500,
            item: { type: 'service' },
          },
        ],
      });
      const rows = projectBill(bill, 500, '2026-02-01', 2);
      expect(rows[0].accountId).toBe(300);
    });
  });

  describe('projectCreditNote — refund-driven negative revenue', () => {
    it('emits debit rows on the original sellAccountId at the refund date', () => {
      const creditNote = {
        total: 200,
        exchangeRate: 1,
        entries: [{ sellAccountId: 200, totalExcludingTax: 200 }],
      };
      const rows = projectCreditNote(creditNote, 200, '2026-05-10', 1);
      expect(rows).toEqual([
        {
          accountId: 200,
          credit: 0,
          debit: 200,
          date: '2026-05-10',
          branchId: 1,
        },
      ]);
    });
  });

  describe('projectVendorCredit — refund-driven negative expense', () => {
    it('emits credit rows on the original expense account at the refund date', () => {
      const vendorCredit = {
        total: 100,
        exchangeRate: 1,
        entries: [{ costAccountId: 300, totalExcludingTax: 100 }],
      };
      const rows = projectVendorCredit(vendorCredit, 100, '2026-05-10', null);
      expect(rows).toEqual([
        {
          accountId: 300,
          credit: 100,
          debit: 0,
          date: '2026-05-10',
          branchId: null,
        },
      ]);
    });
  });

  describe('aggregateByAccount', () => {
    it('sums credit/debit per accountId', () => {
      const rows = [
        {
          accountId: 200,
          credit: 100,
          debit: 0,
          date: '2026-02-01',
          branchId: 1,
        },
        {
          accountId: 200,
          credit: 50,
          debit: 0,
          date: '2026-02-15',
          branchId: 1,
        },
        {
          accountId: 201,
          credit: 75,
          debit: 0,
          date: '2026-02-15',
          branchId: 1,
        },
      ];
      const out = aggregateByAccount(rows);
      expect(out).toContainEqual({ accountId: 200, credit: 150, debit: 0 });
      expect(out).toContainEqual({ accountId: 201, credit: 75, debit: 0 });
    });
  });

  describe('aggregateByAccountAndPeriod', () => {
    it('buckets rows into YYYY-MM periods by month', () => {
      const rows = [
        {
          accountId: 200,
          credit: 100,
          debit: 0,
          date: '2026-02-10',
          branchId: 1,
        },
        {
          accountId: 200,
          credit: 50,
          debit: 0,
          date: '2026-02-25',
          branchId: 1,
        },
        {
          accountId: 200,
          credit: 30,
          debit: 0,
          date: '2026-03-05',
          branchId: 1,
        },
      ];
      const out = aggregateByAccountAndPeriod(rows, 'YYYY-MM');
      expect(out).toContainEqual({
        accountId: 200,
        credit: 150,
        debit: 0,
        date: '2026-02',
      });
      expect(out).toContainEqual({
        accountId: 200,
        credit: 30,
        debit: 0,
        date: '2026-03',
      });
    });
  });
});
