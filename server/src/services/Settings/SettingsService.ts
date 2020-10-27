import { Service, Inject } from "typedi";
import TenancyService from 'services/Tenancy/TenancyService';

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

    this.logger.info('[settings] increment the next number.', { tenantId, findQuery });
    const currentNumber = settings.find(findQuery);

    if (currentNumber) {
      const nextNumber = parseInt(currentNumber.value, 10) + 1;
      settings.set(findQuery, nextNumber);

      await settings.save();
    }
  }
}