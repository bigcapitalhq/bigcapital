import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';
import { authHeaders, cancelTransactionsLock } from './_utils/gl';
import { ChromiumlyTenancy } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.service';
import { HtmlTableCss as AgingSummaryCss } from '@/modules/FinancialStatements/modules/AgingSummary/_constants';
import { HtmlTableCustomCss as BalanceSheetCss } from '@/modules/FinancialStatements/modules/BalanceSheet/constants';
import { HtmlTableCustomCss as CashflowCss } from '@/modules/FinancialStatements/modules/CashFlowStatement/constants';
import { HtmlTableCustomCss as CustomerBalanceSummaryCss } from '@/modules/FinancialStatements/modules/CustomerBalanceSummary/constants';
import { HtmlTableCustomCss as GeneralLedgerCss } from '@/modules/FinancialStatements/modules/GeneralLedger/constants';
import { HtmlTableCustomCss as InventoryItemDetailsCss } from '@/modules/FinancialStatements/modules/InventoryItemDetails/constant';
import { HtmlTableCustomCss as InventoryValuationCss } from '@/modules/FinancialStatements/modules/InventoryValuationSheet/_constants';
import { HtmlTableCustomCss as InventorySummaryCss } from '@/modules/FinancialStatements/modules/InventorySummary/constants';
import { HtmlTableCustomCss as JournalCss } from '@/modules/FinancialStatements/modules/JournalSheet/constant';
import { HtmlTableCustomCss as ProfitLossCss } from '@/modules/FinancialStatements/modules/ProfitLossSheet/constants';
import { HtmlTableCustomCss as PurchasesByItemsCss } from '@/modules/FinancialStatements/modules/PurchasesByItems/_types';
import { HtmlTableCustomCss as SalesByItemsCss } from '@/modules/FinancialStatements/modules/SalesByItems/constants';
import { HtmlTableCustomCss as TransactionsByVendorsCss } from '@/modules/FinancialStatements/modules/TransactionsByVendor/constants';
import { HtmlTableCustomCss as TrialBalanceCss } from '@/modules/FinancialStatements/modules/TrialBalanceSheet/_constants';
import { HtmlTableCustomCss as VendorBalanceSummaryCss } from '@/modules/FinancialStatements/modules/VendorBalanceSummary/constants';

/**
 * Reports whose PDF passes its own custom CSS to the PDF template.
 */
const REPORTS: Array<[string, string, string]> = [
  ['balance sheet', '/reports/balance-sheet', BalanceSheetCss],
  ['profit/loss sheet', '/reports/profit-loss-sheet', ProfitLossCss],
  ['cashflow statement', '/reports/cashflow-statement', CashflowCss],
  ['trial balance sheet', '/reports/trial-balance-sheet', TrialBalanceCss],
  ['general ledger', '/reports/general-ledger', GeneralLedgerCss],
  ['journal', '/reports/journal', JournalCss],
  [
    'receivable aging summary',
    '/reports/receivable-aging-summary',
    AgingSummaryCss,
  ],
  ['payable aging summary', '/reports/payable-aging-summary', AgingSummaryCss],
  [
    'customer balance summary',
    '/reports/customer-balance-summary',
    CustomerBalanceSummaryCss,
  ],
  [
    'vendor balance summary',
    '/reports/vendor-balance-summary',
    VendorBalanceSummaryCss,
  ],
  [
    'transactions by vendors',
    '/reports/transactions-by-vendors',
    TransactionsByVendorsCss,
  ],
  [
    'inventory item details',
    '/reports/inventory-item-details',
    InventoryItemDetailsCss,
  ],
  [
    'inventory valuation',
    '/reports/inventory-valuation',
    InventoryValuationCss,
  ],
  ['inventory summary', '/reports/inventory-summary', InventorySummaryCss],
  ['sales by items', '/reports/sales-by-items', SalesByItemsCss],
  ['purchases by items', '/reports/purchases-by-items', PurchasesByItemsCss],
];

/**
 * The rule report PDFs get when "Show negative in red." is on.
 */
const NegativeAmountPdfCss =
  'table tbody tr td.is-negative-amount { color: #ac2f33; }';

/**
 * Every report PDF that renders today, with the query it needs. Customers
 * Transactions is left out: its PDF returns 500 on develop for an unrelated
 * reason (TransactionsByCustomersPdf is not @Injectable()).
 */
const PDF_REPORTS: Array<[string, string, Record<string, unknown>?]> = [
  ...REPORTS.map(([name, path]): [string, string, Record<string, unknown>?] => [
    name,
    path,
  ]),
  [
    'sales tax liability summary',
    '/reports/sales-tax-liability-summary',
    { basis: 'accrual' },
  ],
];

describe('Financial statement PDFs (e2e)', () => {
  let convertHtmlContent: jest.SpyInstance;

  beforeEach(() => {
    convertHtmlContent = jest
      .spyOn(ChromiumlyTenancy.prototype, 'convertHtmlContent')
      .mockResolvedValue(Buffer.from('%PDF-1.4'));
  });

  afterEach(() => {
    convertHtmlContent.mockRestore();
  });

  /**
   * Requests the report as PDF and returns the HTML handed to the converter.
   */
  const fetchPdfHtml = async (
    path: string,
    query: Record<string, unknown> = {},
  ): Promise<string> => {
    convertHtmlContent.mockClear();
    await request(app.getHttpServer())
      .get(path)
      .query(query)
      .set(authHeaders())
      .set('Accept', 'application/pdf')
      .expect(200);

    expect(convertHtmlContent).toHaveBeenCalledTimes(1);
    return convertHtmlContent.mock.calls[0][0];
  };

  it.each(REPORTS)('%s PDF includes its custom CSS', async (_, path, css) => {
    const html = await fetchPdfHtml(path);

    expect(html).toContain(css);
  });

  it('balance sheet PDF rows carry space-separated row classes', async () => {
    const html = await fetchPdfHtml('/reports/balance-sheet', {
      noneZero: false,
      noneTransactions: false,
    });

    expect(html).toMatch(/<tr class="row-type--total row-id--assets[ "]/);
    expect(html).not.toMatch(/<tr class="[^"]*,/);
  });

  it('echoes numberFormat.showInRed in the report query', async () => {
    // The webapp sends snake_case query keys; the serializer converts them.
    const res = await request(app.getHttpServer())
      .get('/reports/balance-sheet')
      .query({ 'number_format[show_in_red]': 'true' })
      .set(authHeaders())
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.query.number_format.show_in_red).toBe(true);
  });

  it.each(PDF_REPORTS)(
    '%s PDF adds the negative colour only when the switch is on',
    async (_, path, query = {}) => {
      const on = await fetchPdfHtml(path, {
        ...query,
        'number_format[show_in_red]': 'true',
      });
      expect(on).toContain(NegativeAmountPdfCss);

      const off = await fetchPdfHtml(path, query);
      expect(off).not.toContain(NegativeAmountPdfCss);
    },
  );

  it('trial balance PDF marks a negative account balance', async () => {
    // A new cash account credited 100.00 by a published manual journal: its
    // balance (debit - credit) is exactly -100.00.
    await cancelTransactionsLock();
    const account = await request(app.getHttpServer())
      .post('/accounts')
      .set(authHeaders())
      .send({
        name: `PDF red ${Date.now()}`,
        accountType: 'cash',
        code: faker.string.alphanumeric(6).toUpperCase(),
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/manual-journals')
      .set(authHeaders())
      .send({
        date: '2025-06-01',
        reference: faker.string.uuid(),
        journalNumber: faker.string.uuid(),
        publish: true,
        entries: [
          { index: 1, credit: 100, debit: 0, accountId: account.body.id },
          { index: 2, credit: 0, debit: 100, accountId: 1004 },
        ],
      })
      .expect(201);

    const html = await fetchPdfHtml('/reports/trial-balance-sheet', {
      fromDate: '2025-01-01',
      toDate: '2025-12-31',
      'number_format[show_in_red]': 'true',
    });
    const row = html.match(
      new RegExp(
        `<tr class="row-type--account row-id--${account.body.id}[ "][\\s\\S]*?</tr>`,
      ),
    )?.[0];

    expect(row).toBeDefined();
    expect(row!.match(/is-negative-amount/g)).toHaveLength(1);
    expect(row).toMatch(
      /<td class="cell--total is-negative-amount[^"]*"><span>-[^<]*100\.00<\/span>/,
    );
  });
});
