import { ServiceError } from '@/modules/Items/ServiceError';
import { BranchesSettingsService } from '../BranchesSettings';
import { ERRORS } from './constants';
import { Inject, Injectable } from '@nestjs/common';
import { Branch } from '../models/Branch.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ValidateBranchExistance {
  constructor(
    private readonly branchesSettings: BranchesSettingsService,

    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Validate transaction branch id when the feature is active.
   * @param {number} branchId
   * @returns {Promise<void>}
   */
  public validateTransactionBranchWhenActive = async (
    branchId: number | null,
  ) => {
    const isActive = this.branchesSettings.isMultiBranchesActive();

    // Can't continue if the multi-warehouses feature is inactive.
    if (!isActive) return;

    return this.validateTransactionBranch(branchId);
  };

  /**
   * Validate transaction branch id existance.
   * @param {number} branchId
   * @return {Promise<void>}
   */
  public validateTransactionBranch = async (branchId: number | null) => {
    this.validateBranchIdExistance(branchId);

    await this.validateBranchExistance(branchId);
  };

  /**
   * Validates the branch id existance.
   * @param {number} branchId
   */
  public validateBranchIdExistance = (branchId: number | null) => {
    if (!branchId) {
      throw new ServiceError(ERRORS.BRANCH_ID_REQUIRED);
    }
  };

  /**
   * Validates the branch id existance.
   * @param {number} branchId
   */
  public validateBranchExistance = async (branchId: number) => {
    const branch = await this.branchModel().query().findById(branchId);

    if (!branch) {
      throw new ServiceError(ERRORS.BRANCH_ID_NOT_FOUND);
    }
  };
}
