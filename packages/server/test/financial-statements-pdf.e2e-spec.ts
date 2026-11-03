import request = require('supertest');
import { app } from './init-app-test';
import { authHeaders } from './_utils/gl';
import { ChromiumlyTenancy } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.service';
import { HtmlTableCss as AgingSummaryCss } from '@/modules/FinancialStatements/modules/AgingSummary/_constants';
import { HtmlTableCustomCss as BalanceSheetCss } from '@/modules/FinancialStatements/modules/BalanceSheet/constants';
import { HtmlTableCustomCss as CashflowCss } from '@/modules/FinancialStatements/modules/CashFlowStatement/constants';
import { HtmlTableCustomCss as CustomerBalanceSummaryCss } from '@/modules/FinancialStatements/modules/CustomerBalanceSummary/constants';
import { HtmlTableCustomCss as GeneralLedgerCss } from '@/modules/FinancialStatements/modules/GeneralLedger/constants';
import { HtmlTableCustomCss as InventoryItemDetailsCss } from '@/modules/FinancialStatements/modules/InventoryItemDetails/constant';
import { HtmlTableCustomCss as InventoryValuationCss } from '@/modules/FinancialStatements/modules/InventoryValuationSheet/_constants';
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
  ['sales by items', '/reports/sales-by-items', SalesByItemsCss],
  ['purchases by items', '/reports/purchases-by-items', PurchasesByItemsCss],
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
});
