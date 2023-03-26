import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';

@Service()
export class GetBranches {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves branches list.
   * @param {number} tenantId 
   * @param {number} branchId 
   * @returns 
   */
  public getBranches = async (tenantId: number) => {
    const { Branch } = this.tenancy.models(tenantId);

    const branches = await Branch.query().orderBy('name', 'DESC');

    return branches;
  };
}
