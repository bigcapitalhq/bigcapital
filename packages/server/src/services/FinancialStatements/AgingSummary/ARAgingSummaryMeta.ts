import { Inject, Service } from 'typedi';
import { IAgingSummaryMeta, IAgingSummaryQuery } from '@/interfaces';
import { AgingSummaryMeta } from './AgingSummaryMeta';

@Service()
export class ARAgingSummaryMeta {
  @Inject()
  private agingSummaryMeta: AgingSummaryMeta;

  /**
   * Retrieve the aging summary meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: IAgingSummaryQuery
  ): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(tenantId, query);

    return {
      ...commonMeta,
      sheetName: 'A/R Aging Summary',
    };
  }
}
