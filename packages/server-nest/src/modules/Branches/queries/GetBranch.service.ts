import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Branch } from '../models/Branch.model';

@Injectable()
export class GetBranchService {
  constructor(
    @Inject(Branch.name)
    private readonly branch: typeof Branch,
  ) {}

  /**
   * Retrieves the given branch details.
   * @param {number} branchId
   * @returns {Promise<IBranch>}
   */
  public getBranch = async (branchId: number): Promise<Branch> => {
    const branch = await this.branch
      .query()
      .findById(branchId)
      .throwIfNotFound();

    return branch;
  };
}
