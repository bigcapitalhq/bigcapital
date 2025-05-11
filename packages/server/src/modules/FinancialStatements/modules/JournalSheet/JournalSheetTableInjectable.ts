import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JournalSheetService } from './JournalSheetService';
import { IJournalReportQuery, IJournalTable } from './JournalSheet.types';
import { JournalSheetTable } from './JournalSheetTable';

@Injectable()
export class JournalSheetTableInjectable {
  constructor(
    private readonly journalSheetService: JournalSheetService,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Retrieves the journal sheet in table format.
   * @param {IJournalReportQuery} query - Journal report query.
   * @returns {Promise<IJournalTable>}
   */
  public async table(query: IJournalReportQuery): Promise<IJournalTable> {
    const journal = await this.journalSheetService.journalSheet(query);
    const table = new JournalSheetTable(
      journal.data,
      journal.query,
      this.i18nService,
    );
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
