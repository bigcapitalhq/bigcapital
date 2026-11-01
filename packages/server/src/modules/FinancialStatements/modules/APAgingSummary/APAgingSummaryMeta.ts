import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  IAgingSummaryMeta,
  IAgingSummaryQuery,
} from '../AgingSummary/AgingSummary.types';
import { AgingSummaryMeta } from '../AgingSummary/AgingSummaryMeta';

@Injectable()
export class APAgingSummaryMeta {
  constructor(
    private readonly agingSummaryMeta: AgingSummaryMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the aging summary meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(query);

    return {
      ...commonMeta,
      sheetName: this.i18n.t('aging_summary.ap_sheet_name'),
    };
  }
}
