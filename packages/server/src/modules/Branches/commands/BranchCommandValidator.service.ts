import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { Branch } from '../models/Branch.model';

import { ServiceError } from '../../Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
@Injectable()
export class BranchCommandValidator {
  constructor(
    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Validates the given branch whether is not only warehouse.
   * @param {number} branchId
   */
  public validateBranchNotOnlyWarehouse = async (branchId: number) => {
    const warehouses = await this.branchModel()
      .query()
      .whereNot('id', branchId);

    if (warehouses.length === 0) {
      throw new ServiceError(ERRORS.COULD_NOT_DELETE_ONLY_BRANCH);
    }
  };

  /**
   * Validates the given branch whether is unique.
   * @param {string} code - Branch code.
   * @param {number} exceptBranchId - Branch id to except.
   */
  public validateBranchCodeUnique = async (
    code: string,
    exceptBranchId?: number,
  ): Promise<void> => {
    const branch = await this.branchModel()
      .query()
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
