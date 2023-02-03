import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class SettingsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Increment next number based on the given find query.
   * @param {number} tenantId
   * @param {any} findQuery
   */
  async incrementNextNumber(tenantId: number, findQuery: any): Promise<void> {
    const settings = this.tenancy.settings(tenantId);

    this.logger.info('[settings] increment the next number.', {
      tenantId,
      findQuery,
    });
    const currentNumber = settings.find(findQuery);

    if (currentNumber) {
      const nextNumber = parseInt(currentNumber.value, 10) + 1;
      settings.set(findQuery, nextNumber);

      await settings.save();
    }
  }

  /**
   * Validates the given options is defined or either not.
   * @param {Array} options
   * @return {Boolean}
   */
  validateNotDefinedSettings(tenantId: number, options) {
    const notDefined = [];

    const settings = this.tenancy.settings(tenantId);

    options.forEach((option) => {
      const setting = settings.config.getMetaConfig(option.key, option.group);

      if (!setting) {
        notDefined.push(option);
      }
    });
    return notDefined;
  }
}
