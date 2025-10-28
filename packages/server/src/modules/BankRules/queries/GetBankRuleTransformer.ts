import { Transformer } from "@/modules/Transformer/Transformer";

export class GetBankRuleTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [];
  };
}
