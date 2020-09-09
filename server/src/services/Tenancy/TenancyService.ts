import { Container, Service } from 'typedi';

@Service()
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
   * Retrieve knex instance of the given tenant id.
   * @param {number} tenantId 
   */
  knex(tenantId: number) {
    return this.tenantContainer(tenantId).get('knex');
  }

  /**
   * Retrieve models of the givne tenant id. 
   * @param {number} tenantId - The tenant id.
   */
  models(tenantId: number) {
    return this.tenantContainer(tenantId).get('models');
  }

  /**
   * Retrieve repositories of the given tenant id.
   * @param {number} tenantId 
   */
  repositories(tenantId: number) {
    return this.tenantContainer(tenantId).get('repositories');
  }

  /**
   * Retrieve i18n locales methods.
   * @param {number} tenantId 
   */
  i18n(tenantId: number) {
    return this.tenantContainer(tenantId).get('i18n');
  }

  /**
   * Retrieve tenant cache instance.
   * @param {number} tenantId -
   */
  cache(tenantId: number) {
    return this.tenantContainer(tenantId).get('cache');
  }
}