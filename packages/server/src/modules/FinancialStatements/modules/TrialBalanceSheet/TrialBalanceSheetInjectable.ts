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
import { AccountingBasisService } from '../../common/AccountingBasisService';

@Injectable()
export class TrialBalanceSheetService {
  constructor(
    private readonly trialBalanceSheetMetaService: TrialBalanceSheetMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly trialBalanceSheetRepository: TrialBalanceSheetRepository,
    private readonly tenancyContext: TenancyContext,
    private readonly accountingBasisService: AccountingBasisService,
  ) {}

  /**
   * Retrieve trial balance sheet statement.
   * @param {ITrialBalanceSheetQuery} query - Trial balance sheet query.
   * @return {ITrialBalanceStatement}
   */
  public async trialBalanceSheet(
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceStatement> {
    const filter = await this.accountingBasisService.resolveQuery({
      ...getTrialBalanceSheetDefaultQuery(),
      ...query,
    });

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    // Loads the resources.
    await this.trialBalanceSheetRepository.asyncInitialize(filter);

    // Trial balance sheet meta first to get date format.
    const meta = await this.trialBalanceSheetMetaService.meta(filter);

    // Trial balance report instance.
    const trialBalanceInstance = new TrialBalanceSheet(
      filter,
      this.trialBalanceSheetRepository,
      {
        baseCurrency: tenantMetadata.baseCurrency,
        dateFormat: meta.dateFormat,
      },
    );
    // Trial balance sheet data.
    const trialBalanceSheetData = trialBalanceInstance.reportData();

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
