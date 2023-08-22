import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';
import { BranchesSettings } from '../BranchesSettings';
import { ERRORS } from './constants';

@Service()
export class ValidateBranchExistance {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  branchesSettings: BranchesSettings;

  /**
   * Validate transaction branch id when the feature is active.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<void>}
   */
  public validateTransactionBranchWhenActive = async (
    tenantId: number,
    branchId: number | null
  ) => {
    const isActive = this.branchesSettings.isMultiBranchesActive(tenantId);

    // Can't continue if the multi-warehouses feature is inactive.
    if (!isActive) return;

    return this.validateTransactionBranch(tenantId, branchId);
  };

  /**
   * Validate transaction branch id existance.
   * @param  {number} tenantId
   * @param  {number} branchId
   * @return {Promise<void>}
   */
  public validateTransactionBranch = async (
    tenantId: number,
    branchId: number | null
  ) => {
    this.validateBranchIdExistance(branchId);

    await this.validateBranchExistance(tenantId, branchId);
  };

  /**
   *
   * @param branchId
   */
  public validateBranchIdExistance = (branchId: number | null) => {
    if (!branchId) {
      throw new ServiceError(ERRORS.BRANCH_ID_REQUIRED);
    }
  };

  /**
   *
   * @param tenantId
   * @param branchId
   */
  public validateBranchExistance = async (
    tenantId: number,
    branchId: number
  ) => {
    const { Branch } = this.tenancy.models(tenantId);

    const branch = await Branch.query().findById(branchId);

    if (!branch) {
      throw new ServiceError(ERRORS.BRANCH_ID_NOT_FOUND);
    }
  };
}
