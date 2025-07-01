import { Transformer } from '@/modules/Transformer/Transformer';

export class GetApiKeysTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'id',
      'key',
      'name',
      'createdAt',
      'expiresAt',
      'revoked',
      'userId',
      'tenantId',
    ];
  };
}
