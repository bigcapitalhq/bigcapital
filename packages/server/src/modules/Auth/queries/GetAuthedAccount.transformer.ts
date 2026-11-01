import { Transformer } from '@/modules/Transformer/Transformer';

export class GetAuthedAccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'firstName',
      'lastName',
      'email',
      'active',
      'language',
      'tenantId',
      'verified',
    ];
  };

  /**
   * Exclude sensitive attributes from the account object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['password', 'verifyToken'];
  };
}
