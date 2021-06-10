import HasTenancyService from 'services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';

@Service()
export default class I18nService {
  @Inject()
  tenancy: HasTenancyService;

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
      return {
        label: i18n.__(_data.label),
        ..._data,
      };
    });
  }
}
