import { Inject, Injectable } from '@nestjs/common';
import { Branch } from '../models/Branch.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetBranchesService {
  constructor(
    @Inject(Branch.name)
    private readonly branch: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Retrieves branches list.
   * @returns
   */
  public getBranches = async () => {
    const branches = await this.branch().query().orderBy('name', 'DESC');

    return branches;
  };
}
