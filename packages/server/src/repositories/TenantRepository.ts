import { Container } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import CachableRepository from './CachableRepository';

export default class TenantRepository extends CachableRepository {
  repositoryName: string;
  tenantId: number;

  /**
   * Constructor method.
   * @param {number} tenantId
   */
  constructor(knex, cache, i18n) {
    super(knex, cache, i18n);
  }

  setTenantId(tenantId: number) {
    this.tenantId = tenantId;
  }
}
