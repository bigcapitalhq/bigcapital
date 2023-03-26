import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export class BranchValidator {
  @Inject()
  tenancy: HasTenancyService;

  public validateBranchNotOnlyWarehouse = async (
    tenantId: number,
    branchId: number
  ) => {
    const { Branch } = this.tenancy.models(tenantId);

    const warehouses = await Branch.query().whereNot('id', branchId);

    if (warehouses.length === 0) {
      throw new ServiceError(ERRORS.COULD_NOT_DELETE_ONLY_BRANCH);
    }
  };

  /**
   * Validates the given branch whether is unique.
   * @param {number} tenantId
   * @param {string} code
   * @param {number} exceptBranchId
   */
  public validateBranchCodeUnique = async (
    tenantId: number,
    code: string,
    exceptBranchId?: number
  ): Promise<void> => {
    const { Branch } = this.tenancy.models(tenantId);

    const branch = await Branch.query()
      .onBuild((query) => {
        query.select(['id']);
        query.where('code', code);

        if (exceptBranchId) {
          query.whereNot('id', exceptBranchId);
        }
      })
      .first();

    if (branch) {
      throw new ServiceError(ERRORS.BRANCH_CODE_NOT_UNIQUE);
    }
  };
}
