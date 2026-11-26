import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import { JournalSheet } from './JournalSheet';
import { JournalSheetMeta } from './JournalSheetMeta';
import { getJournalSheetDefaultQuery } from './constant';
import { IJournalReportQuery, IJournalSheet } from './JournalSheet.types';
import { events } from '@/common/events/events';
import { JournalSheetRepository } from './JournalSheetRepository';
import { AccountingBasisService } from '../../common/AccountingBasisService';

@Injectable()
export class JournalSheetService {
  constructor(
    private readonly journalSheetMeta: JournalSheetMeta,
    private readonly journalRepository: JournalSheetRepository,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18n: I18nService,
    private readonly accountingBasisService: AccountingBasisService,
  ) {}

  /**
   * Journal sheet.
   * @param {IJournalReportQuery} query - Journal sheet query.
   * @returns {Promise<IJournalSheet>}
   */
  async journalSheet(query: IJournalReportQuery): Promise<IJournalSheet> {
    const ledgerFilter = await this.accountingBasisService.resolveQuery(query);
    const filter = {
      ...getJournalSheetDefaultQuery(),
      ...ledgerFilter,
    };
    await this.journalRepository.load(ledgerFilter);

    // Retrieve the journal sheet meta first to get the date format.
    const meta = await this.journalSheetMeta.meta(filter);

    // Journal report instance.
    const journalSheetInstance = new JournalSheet(
      filter,
      this.journalRepository,
      this.i18n,
      { baseCurrency: meta.baseCurrency, dateFormat: meta.dateFormat },
    );
    // Retrieve journal report columns.
    const journalSheetData = journalSheetInstance.reportData();

    // Triggers `onJournalViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onJournalViewed, {
      query,
    });

    return {
      data: journalSheetData,
      query: filter,
      meta,
    };
  }
}
