import { BatchDetailsReportService } from './BatchDetailsReport.service';
import { BatchStatus } from './types/Batches.types';

describe('BatchDetailsReportService', () => {
  const getBatchesService = {
    getBatches: jest.fn(),
  };
  const i18n = {
    t: jest.fn((key: string) => key),
  };
  const tenancyContext = {
    getTenantMetadata: jest.fn(),
  };

  const service = new BatchDetailsReportService(
    getBatchesService as any,
    i18n as any,
    tenancyContext as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    tenancyContext.getTenantMetadata.mockResolvedValue({
      name: 'Acme Inc.',
      baseCurrency: 'USD',
      dateFormat: 'YYYY MMM DD',
    });
  });

  it('trims item names and exposes the raw batch status on each row', async () => {
    getBatchesService.getBatches.mockResolvedValue({
      results: [
        {
          id: 1,
          itemId: 10,
          batchNumber: 'B-001',
          batchRef: null,
          quantity: 10,
          quantityIn: 10,
          quantityOut: 2,
          quantityOnHand: 8,
          status: BatchStatus.Active,
          item: { id: 10, name: '  Widget  ' },
        },
      ],
      pagination: { total: 1, page: 1, pageSize: 1 },
    });

    const report = await service.report({} as any);

    expect(report.table.rows[0].cells[0]).toEqual({
      key: 'item_name',
      value: 'Widget',
    });
    expect(report.table.rows[0].meta).toEqual({
      status: BatchStatus.Active,
    });
  });
});
