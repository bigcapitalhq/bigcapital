import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import { IBalanceSheetMeta } from '@/interfaces';

@Service()
export class BalanceSheetMetaInjectable {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(tenantId: number): Promise<IBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);

    return {
      ...commonMeta,
      sheetName: 'Balance Sheet',
    };
  }
}
