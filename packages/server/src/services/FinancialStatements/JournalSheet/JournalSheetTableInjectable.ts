import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject } from 'typedi';
import { JournalSheetService } from './JournalSheetService';
import { IJournalReportQuery, IJournalTable } from '@/interfaces';
import { JournalSheetTable } from './JournalSheetTable';

export class JournalSheetTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private journalSheetService: JournalSheetService;

  /**
   * Retrieves the journal sheet in table format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {Promise<IJournalTable>}
   */
  public async table(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<IJournalTable> {
    const journal = await this.journalSheetService.journalSheet(
      tenantId,
      query
    );
    const table = new JournalSheetTable(journal.data, journal.query, {});

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableData(),
      },
      query: journal.query,
      meta: journal.meta,
    };
  }
}
