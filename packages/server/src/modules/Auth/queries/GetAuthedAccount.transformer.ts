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
}
