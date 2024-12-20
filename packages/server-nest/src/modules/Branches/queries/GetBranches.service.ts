import { Inject, Injectable } from '@nestjs/common';
import { Branch } from '../models/Branch.model';

@Injectable()
export class GetBranchesService {
  constructor(
    @Inject(Branch.name)
    private readonly branch: typeof Branch,
  ) {}

  /**
   * Retrieves branches list.
   * @returns
   */
  public getBranches = async () => {
    const branches = await this.branch.query().orderBy('name', 'DESC');

    return branches;
  };
}
