import { I18nService } from 'nestjs-i18n';
import { GeneralLedgerMeta } from './GeneralLedgerMeta';
import { GeneralLedgerRepository } from './GeneralLedgerRepository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { GeneralLedgerSheet } from './GeneralLedger';
import { events } from '@/common/events/events';
import { getGeneralLedgerReportQuery } from './_utils';
import {
  IGeneralLedgerMeta,
  IGeneralLedgerSheetQuery,
} from './GeneralLedger.types';

@Injectable()
export class GeneralLedgerService {
  constructor(
    private readonly generalLedgerMeta: GeneralLedgerMeta,
    private readonly eventEmitter: EventEmitter2,
    private readonly generalLedgerRepository: GeneralLedgerRepository,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve general ledger report statement.
   * @param {IGeneralLedgerSheetQuery} query
   * @return {Promise<IGeneralLedgerStatement>}
   */
  public async generalLedger(query: IGeneralLedgerSheetQuery): Promise<{
    data: any;
    query: IGeneralLedgerSheetQuery;
    meta: IGeneralLedgerMeta;
  }> {
    const filter = {
      ...getGeneralLedgerReportQuery(),
      ...query,
    };
    this.generalLedgerRepository.setFilter(filter);
    await this.generalLedgerRepository.asyncInitialize();

    // General ledger report instance.
    const generalLedgerInstance = new GeneralLedgerSheet(
      filter,
      this.generalLedgerRepository,
      this.i18n,
    );
    // Retrieve general ledger report data.
    const reportData = generalLedgerInstance.reportData();

    // Retrieve general ledger report metadata.
    const meta = await this.generalLedgerMeta.meta(filter);

    // Triggers `onGeneralLedgerViewed` event.
    await this.eventEmitter.emitAsync(events.reports.onGeneralLedgerViewed, {});

    return {
      data: reportData,
      query: filter,
      meta,
    };
  }
}
