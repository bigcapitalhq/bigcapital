import { Container } from 'typedi';

export default class HasTenancyService {
  /**
   * Retrieve the given tenant container.
   * @param {number} tenantId 
   * @return {Container}
   */
  tenantContainer(tenantId: number) {
    return Container.of(`tenant-${tenantId}`);
  }

  /**
   * Retrieve models of the givne tenant id. 
   * @param {number} tenantId - The tenant id.
   */
  models(tenantId: number) {
    return this.tenantContainer(tenantId).get('models');
  }

  /**
   * Retrieve i18n locales methods.
   * @param {number} tenantId 
   */
  i18n(tenantId: number) {
    this.tenantContainer(tenantId).get('i18n');
  }
}