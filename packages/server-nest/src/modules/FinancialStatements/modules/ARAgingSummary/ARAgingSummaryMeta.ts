
import { Injectable } from '@nestjs/common';
import { AgingSummaryMeta } from '../AgingSummary/AgingSummaryMeta';
import { IAgingSummaryMeta, IAgingSummaryQuery } from '../AgingSummary/AgingSummary.types';

@Injectable()
export class ARAgingSummaryMeta {
  constructor(
    private readonly agingSummaryMeta: AgingSummaryMeta,
  ) {}

  /**
   * Retrieve the aging summary meta.
   * @param {IAgingSummaryQuery} query - Aging summary query.
   * @returns {IAgingSummaryMeta}
   */
  public async meta(
    query: IAgingSummaryQuery
  ): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(query);

    return {
      ...commonMeta,
      sheetName: 'A/R Aging Summary',
    };
  }
}
