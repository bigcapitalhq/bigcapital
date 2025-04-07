import { Transformer } from "../../Transformer/Transformer";

export class WarehouseTransferItemTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedQuantity', 'formattedCost', 'formattedTotal'];
  };

  /**
   * Formats the total.
   * @param {IWarehouseTransferEntry} entry
   * @returns {string}
   */
  public formattedTotal = (entry) => {
    return this.formatMoney(entry.total);
  };

  /**
   * Formats the quantity.
   * @param {IWarehouseTransferEntry} entry
   * @returns {string}
   */
  public formattedQuantity = (entry) => {
    return this.formatNumber(entry.quantity);
  };

  /**
   * Formats the cost.
   * @param {IWarehouseTransferEntry} entry
   * @returns {string}
   */
  public formattedCost = (entry) => {
    return this.formatMoney(entry.cost);
  };
}
