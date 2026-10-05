import { Transformer } from '@/modules/Transformer/Transformer';

export class GetApiKeysTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return ['id', 'name', 'token', 'createdAt', 'expiresAt', 'revoked'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public token(apiKey) {
    return apiKey.keyPrefix ? `${apiKey.keyPrefix}...` : '';
  }
}
