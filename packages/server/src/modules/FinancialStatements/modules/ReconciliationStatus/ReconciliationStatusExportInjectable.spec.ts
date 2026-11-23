import { Test, TestingModule } from '@nestjs/testing';
import {
  AcceptLanguageResolver,
  I18nContext,
  I18nModule,
  I18nService,
} from 'nestjs-i18n';
import { join } from 'path';
import * as xlsx from 'xlsx';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ReconciliationStatusExportInjectable } from './ReconciliationStatusExportInjectable';
import { ReconciliationStatusPdfInjectable } from './ReconciliationStatusPdfInjectable';
import { ReconciliationReportStatus } from './ReconciliationStatusQuery.dto';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import { ReconciliationStatusTableInjectable } from './ReconciliationStatusTableInjectable';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

describe('Reconciliation Status exports', () => {
  let module: TestingModule;
  let i18n: I18nService;
  const convertToPdf = jest.fn().mockResolvedValue(Buffer.from('PDF'));

  beforeAll(async () => {
    const account = { id: 1, name: '=Bank & Co.', currencyCode: 'USD' };
    module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: { path: join(__dirname, '../../../../i18n') },
          resolvers: [AcceptLanguageResolver],
        }),
      ],
      providers: [
        ReconciliationStatusTableInjectable,
        ReconciliationStatusExportInjectable,
        ReconciliationStatusPdfInjectable,
        { provide: TableSheetPdf, useValue: { convertToPdf } },
        {
          provide: TenancyContext,
          useValue: {
            getTenantMetadata: async () => ({
              name: 'Example Organization',
              dateFormat: 'DD MMM YYYY',
            }),
          },
        },
        {
          provide: ReconciliationStatusService,
          useValue: {
            getReport: async ({ status }) => ({
              bankAccounts: [account],
              accounts: [
                {
                  ...account,
                  openingBalance: 0,
                  closingBalance: 10,
                  transactions: [
                    {
                      id: 1,
                      date: '2026-11-04',
                      reference: '=1+1',
                      type: null,
                      deposit: 10,
                      withdrawal: 0,
                      status,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
    }).compile();
    await module.init();
    i18n = module.get(I18nService);
  });

  afterAll(async () => {
    await module?.close();
  });

  it.each([
    [
      'en',
      ReconciliationReportStatus.Reconciled,
      'Reconciled',
      'Reconciliation Status',
      'From 01 Nov 2026 to 30 Nov 2026',
    ],
    [
      'en',
      ReconciliationReportStatus.Unreconciled,
      'Unreconciled',
      'Reconciliation Status',
      'From 01 Nov 2026 to 30 Nov 2026',
    ],
    [
      'ar',
      ReconciliationReportStatus.Reconciled,
      'تمت التسوية',
      'حالة التسوية البنكية',
      'من 01 نوفمبر 2026 إلى 30 نوفمبر 2026',
    ],
    [
      'ar',
      ReconciliationReportStatus.Unreconciled,
      'لم تتم التسوية',
      'حالة التسوية البنكية',
      'من 01 نوفمبر 2026 إلى 30 نوفمبر 2026',
    ],
  ])(
    'localizes %s status %s across CSV, XLSX and PDF',
    async (locale, status, statusLabel, sheetName, dateRange) => {
      await I18nContext.createAsync(new I18nContext(locale, i18n), async () => {
        const query = { status, fromDate: '2026-11-01', toDate: '2026-11-30' };
        const report = module.get(ReconciliationStatusTableInjectable);
        const exports = module.get(ReconciliationStatusExportInjectable);
        const pdf = module.get(ReconciliationStatusPdfInjectable);

        const response = await report.table(query);
        const row = response.table.rows.find(
          ({ id }) => id === 'transaction-1',
        );
        expect(row.cells).toContainEqual({ key: 'status', value: status });
        expect(response.meta.formattedDateRange).toBe(dateRange);

        const csv = await exports.csv(query);
        expect(csv).toContain(statusLabel);
        expect(csv).toContain("'=1+1");

        const workbook = xlsx.read(await exports.xlsx(query), {
          type: 'buffer',
        });
        expect(workbook.SheetNames).toEqual([sheetName]);
        expect(workbook.Sheets[sheetName].F4.v).toBe(statusLabel);
        expect(workbook.Sheets[sheetName].B4).toMatchObject({
          t: 's',
          v: '=1+1',
        });
        expect(workbook.Sheets[sheetName].B4.f).toBeUndefined();

        await pdf.pdf(query);
        const [pdfTable, , pdfTitle, pdfDateRange] = convertToPdf.mock.lastCall;
        const pdfRow = pdfTable.rows.find(({ id }) => id === 'transaction-1');
        expect(pdfRow.cells).toContainEqual({
          key: 'status',
          value: statusLabel,
        });
        expect(pdfTable.rows[0].cells[0].value).toBe('=Bank &amp; Co. (USD)');
        expect(pdfTitle).toBe(`${sheetName} (${statusLabel})`);
        expect(pdfDateRange).toBe(dateRange);
      });
    },
  );
});
