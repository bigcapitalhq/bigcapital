import { WarehouseTransferItemTransformer } from './WarehouseTransferItemTransformer';
import { Transformer } from '@/modules/Transformer/Transformer';
export class WarehouseTransferTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedDate', 'entries'];
  };

  /**
   *
   * @param transfer
   * @returns
   */
  protected formattedDate = (transfer) => {
    return this.formatDate(transfer.date);
  };

  /**
   *
   */
  protected entries = (transfer) => {
    return this.item(transfer.entries, new WarehouseTransferItemTransformer());
  };
}
