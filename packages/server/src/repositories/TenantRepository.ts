import CachableRepository from './CachableRepository';

export default class TenantRepository extends CachableRepository {
  repositoryName: string;

  /**
   * Constructor method.
   * @param {number} tenantId
   */
  constructor(knex, cache, i18n) {
    super(knex, cache, i18n);
  }
}
