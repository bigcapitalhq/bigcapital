import { Transformer } from '@/modules/Transformer/Transformer';

export class GetApiKeysTransformer extends Transformer {
  /**
   * Whitelisted attributes to expose in the response.
   */
  public includeAttributes = (): string[] => {
    return ['id', 'name', 'token', 'createdAt', 'expiresAt', 'revoked'];
  };

  /**
   * Excludes all attributes except the whitelisted ones.
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Masks the API key prefix for display purposes.
   */
  public token(apiKey) {
    return apiKey.keyPrefix ? `${apiKey.keyPrefix}...` : '';
  }
}
