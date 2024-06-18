import { Transformer } from '@/lib/Transformer/Transformer';

export class GetBankRulesTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [];
  };
}
