import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import { CURDBranch } from './CRUDBranch';

@Service()
export class GetBranch extends CURDBranch{
  @Inject()
  tenancy: HasTenancyService;

  /**
   * 
   * @param {number} tenantId 
   * @param {number} branchId 
   * @returns 
   */
  public getBranch = async (tenantId: number, branchId: number) => {
    const { Branch } = this.tenancy.models(tenantId);

    const branch = await Branch.query().findById(branchId);

    // Throw not found service error if the branch not found.
    this.throwIfBranchNotFound(branch);

    return branch;
  };
}
