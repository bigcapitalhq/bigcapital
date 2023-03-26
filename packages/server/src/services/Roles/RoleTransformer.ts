import { Transformer } from '@/lib/Transformer/Transformer';

export class RoleTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['name', 'description'];
  };

  /**
   * 
   * @param role 
   * @returns 
   */
  public name(role) {
    return role.predefined ? this.context.i18n.__(role.name) : role.name;
  }

  /**
   * 
   * @param role 
   * @returns 
   */
  public description(role) {
    return role.predefined
      ? this.context.i18n.__(role.description)
      : role.description;
  }
}
