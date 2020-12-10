import { Container } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';
import CachableRepository from './CachableRepository';

export default class TenantRepository extends CachableRepository {
  repositoryName: string;
  tenantId: number;
  tenancy: TenancyService;
  modelsInstance: any;
  repositoriesInstance: any;
  cacheInstance: any;
  
  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(tenantId: number) {
    super();

    this.tenantId = tenantId;
    this.tenancy = Container.get(TenancyService);
    this.repositoryName = this.constructor.name;
  }

  get models() {
    if (!this.modelsInstance) {
      this.modelsInstance = this.tenancy.models(this.tenantId);
    }
    return this.modelsInstance;
  }

  get repositories() {
    if (!this.repositoriesInstance) {
      this.repositoriesInstance = this.tenancy.repositories(this.tenantId);
    }
    return this.repositoriesInstance;
  }

  get cache() {
    if (!this.cacheInstance) {
      this.cacheInstance = this.tenancy.cache(this.tenantId);
    }
    return this.cacheInstance;
  }
}