import { Service, Inject } from 'typedi';
import { Features } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class BranchesSettings {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Marks multi-branches as activated.
   * @param {number} tenantId -
   */
  public markMultiBranchesAsActivated = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    settings.set({ group: 'features', key: Features.BRANCHES, value: 1 });
  };

  /**
   * Retrieves whether multi-branches is active.
   * @param {number} tenantId
   */
  public isMultiBranchesActive = (tenantId: number) => {
    const settings = this.tenancy.settings(tenantId);

    return settings.get({ group: 'features', key: Features.BRANCHES });
  };
}
