import { Container } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';

export default class TenantRepository {
  tenantId: number;
  tenancy: TenancyService;

  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(tenantId: number) {
    this.tenantId = tenantId;
    this.tenancy = Container.get(TenancyService);
  }
}