import { Container } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';
import CachableRepository from './CachableRepository';

export default class TenantRepository extends CachableRepository {
  repositoryName: string;
   
  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.repositoryName = this.constructor.name;
  }
}