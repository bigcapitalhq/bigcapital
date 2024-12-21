import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchesSettingsService {
  /**
   * Marks multi-branches as activated.
   */
  public markMultiBranchesAsActivated = () => {
    // const settings = this.tenancy.settings(tenantId);

    // settings.set({ group: 'features', key: Features.BRANCHES, value: 1 });
  };

  /**
   * Retrieves whether multi-branches is active.
   */
  public isMultiBranchesActive = () => {
    // const settings = this.tenancy.settings(tenantId);

    // return settings.get({ group: 'features', key: Features.BRANCHES });
    return false;
  };
}
