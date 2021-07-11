import HasTenancyService from 'services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';

@Service()
export default class I18nService {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * 
   * @param i18n 
   * @param attributes 
   * @param data 
   * @returns 
   */
  private i18nAttributesMapper(i18n, attributes, data) {
    return attributes.reduce((acc, attr, index) => {
      return {
        ...acc,
        [attr]: i18n.__(acc[attr]),
      };
    }, data);
  }

  /**
   * Mappes array collection to i18n localization based in given attributes.
   * @param {Array<any>} data - Array collection.
   * @param {string[]} attributes - Attributes.
   * @param {number} tenantId - Tenant id.
   */
  public i18nMapper(
    data: Array<any>,
    attributes: string[] = [],
    tenantId: number
  ) {
    const i18n = this.tenancy.i18n(tenantId);

    return data.map((_data) => {
      const newData = this.i18nAttributesMapper(i18n, attributes, _data);

      return {
        ..._data,
        ...newData,
      };
    });
  }
}
