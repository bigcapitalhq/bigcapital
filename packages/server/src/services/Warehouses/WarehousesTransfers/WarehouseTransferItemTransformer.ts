import { Transformer } from '@/lib/Transformer/Transformer';

export class WarehouseTransferItemTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedQuantity', 'formattedCost', 'formattedTotal'];
  };

  /**
   *
   * @param entry
   * @returns
   */
  public formattedTotal = (entry) => {
    return this.formatMoney(entry.total);
  };

  /**
   *
   * @param entry
   * @returns
   */
  public formattedQuantity = (entry) => {
    return this.formatNumber(entry.quantity);
  };

  /**
   *
   * @param entry
   * @returns
   */
  public formattedCost = (entry) => {
    return this.formatMoney(entry.cost);
  };
}
