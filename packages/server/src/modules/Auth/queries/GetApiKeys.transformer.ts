import { Transformer } from '@/modules/Transformer/Transformer';

export class GetApiKeysTransformer extends Transformer {
  public excludeAttributes = (): string[] => {
    return ['tenantId'];
  };
}
