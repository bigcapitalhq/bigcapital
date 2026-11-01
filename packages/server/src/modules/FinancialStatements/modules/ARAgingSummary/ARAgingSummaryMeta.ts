import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AgingSummaryMeta } from '../AgingSummary/AgingSummaryMeta';
import {
  IAgingSummaryMeta,
  IAgingSummaryQuery,
} from '../AgingSummary/AgingSummary.types';

@Injectable()
export class ARAgingSummaryMeta {
  constructor(
    private readonly agingSummaryMeta: AgingSummaryMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the aging summary meta.
   * @param {IAgingSummaryQuery} query - Aging summary query.
   * @returns {IAgingSummaryMeta}
   */
  public async meta(query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(query);

    return {
      ...commonMeta,
      sheetName: this.i18n.t('aging_summary.ar_sheet_name'),
    };
  }
}
