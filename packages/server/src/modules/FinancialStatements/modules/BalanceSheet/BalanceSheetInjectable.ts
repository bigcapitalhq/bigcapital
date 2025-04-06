// @ts-nocheck
import {
  IBalanceSheetDOO,
  IBalanceSheetQuery,
} from './BalanceSheet.types';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { BalanceSheetMetaInjectable } from './BalanceSheetMeta';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { BalanceSheet } from './BalanceSheet';
import { getBalanceSheetDefaultQuery } from './constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BalanceSheetInjectable {
  constructor(
    private readonly balanceSheetMeta: BalanceSheetMetaInjectable,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
    private readonly balanceSheetRepository: BalanceSheetRepository,
  ) {}

  /**
   * Retrieve balance sheet statement.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @return {Promise<IBalanceSheetStatement>}
   */
  public async balanceSheet(
    query: IBalanceSheetQuery,
  ): Promise<IBalanceSheetDOO> {
    const filter = {
      ...getBalanceSheetDefaultQuery(),
      ...query,
    };
    const tenantMetadata = await this.tenancyContext.getTenantMetadata(true);

    // Loads all resources.
    await this.balanceSheetRepository.asyncInitialize(filter);

    // Balance sheet report instance.
    const balanceSheetInstanace = new BalanceSheet(
      filter,
      this.balanceSheetRepository,
      tenantMetadata.baseCurrency,
      this.i18n,
    );
    // Balance sheet data.
    const data = balanceSheetInstanace.reportData();

    // Balance sheet meta.
    const meta = await this.balanceSheetMeta.meta(filter);

    // Triggers `onBalanceSheetViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onBalanceSheetViewed, {
      query,
    });
    return {
      query: filter,
      data,
      meta,
    };
  }
}
