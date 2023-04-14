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
   * Retrieves the localized role name if is predefined or stored name.
   * @param role 
   * @returns {string}
   */
  public name(role) {
    return role.predefined ? this.context.i18n.__(role.name) : role.name;
  }

  /**
   * Retrieves the localized role description if is predefined or stored description.
   * @param role 
   * @returns {string}
   */
  public description(role) {
    return role.predefined
      ? this.context.i18n.__(role.description)
      : role.description;
  }
}
