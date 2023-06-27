import { Transformer } from '@/lib/Transformer/Transformer';

export class UserTransformer extends Transformer {
  /**
   * Exclude these attributes from user object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['role'];
  };

  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['roleName', 'roleDescription', 'roleSlug'];
  };

  /**
   * Retrieves the localized role name if is predefined or stored name.
   * @param role
   * @returns {string}
   */
  public roleName(user) {
    return user.role.predefined
      ? this.context.i18n.__(user.role.name)
      : user.role.name;
  }

  /**
   * Retrieves the localized role description if is predefined or stored description.
   * @param user
   * @returns {string}
   */
  public roleDescription(user) {
    return user.role.predefined
      ? this.context.i18n.__(user.role.description)
      : user.role.description;
  }

  /**
   * Retrieves the role slug.
   * @param user
   * @returns {string}
   */
  public roleSlug(user) {
    return user.role.slug;
  }
}
