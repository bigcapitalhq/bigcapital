import {
  ITrialBalanceSheetQuery,
  ITrialBalanceStatement,
} from './TrialBalanceSheet.types';
import { TrialBalanceSheet } from './TrialBalanceSheet';
import { TrialBalanceSheetRepository } from './TrialBalanceSheetRepository';
import { TrialBalanceSheetMeta } from './TrialBalanceSheetMeta';
import { getTrialBalanceSheetDefaultQuery } from './_utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class TrialBalanceSheetService {
  constructor(
    private readonly trialBalanceSheetMetaService: TrialBalanceSheetMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly trialBalanceSheetRepository: TrialBalanceSheetRepository,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve trial balance sheet statement.
   * @param {ITrialBalanceSheetQuery} query - Trial balance sheet query.
   * @return {ITrialBalanceStatement}
   */
  public async trialBalanceSheet(
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceStatement> {
    const filter = {
      ...getTrialBalanceSheetDefaultQuery(),
      ...query,
    };
    this.trialBalanceSheetRepository.setQuery(filter);

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    // Loads the resources.
    await this.trialBalanceSheetRepository.asyncInitialize();

    // Trial balance report instance.
    const trialBalanceInstance = new TrialBalanceSheet(
      filter,
      this.trialBalanceSheetRepository,
      tenantMetadata.baseCurrency,
    );
    // Trial balance sheet data.
    const trialBalanceSheetData = trialBalanceInstance.reportData();

    // Trial balance sheet meta.
    const meta = await this.trialBalanceSheetMetaService.meta(filter);

    // Triggers `onTrialBalanceSheetViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onTrialBalanceSheetView,
      {
        query,
      },
    );

    return {
      data: trialBalanceSheetData,
      query: filter,
      meta,
    };
  }
}
