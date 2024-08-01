import { Inject, Service } from 'typedi';
import { IFeatureAllItem, ISystemUser } from '@/interfaces';
import { FeaturesManager } from '@/services/Features/FeaturesManager';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import config from '@/config';

interface IRoleAbility {
  subject: string;
  ability: string;
}

interface IDashboardBootMeta {
  abilities: IRoleAbility[];
  features: IFeatureAllItem[];
  isBigcapitalCloud: boolean;
}

@Service()
export default class DashboardService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private featuresManager: FeaturesManager;

  /**
   * Retrieve dashboard meta.
   * @param {number} tenantId
   * @param {number} authorizedUser
   */
  public getBootMeta = async (
    tenantId: number,
    authorizedUser: ISystemUser
  ): Promise<IDashboardBootMeta> => {
    // Retrieves all orgnaization abilities.
    const abilities = await this.getBootAbilities(tenantId, authorizedUser.id);

    // Retrieves all organization features.
    const features = await this.featuresManager.all(tenantId);

    return {
      abilities,
      features,
      isBigcapitalCloud: config.hostedOnBigcapitalCloud
    };
  };

  /**
   * Transformes role permissions to abilities.
   */
  transformRoleAbility = (permissions) => {
    return permissions
      .filter((permission) => permission.value)
      .map((permission) => ({
        subject: permission.subject,
        action: permission.ability,
      }));
  };

  /**
   * Retrieve the boot abilities.
   * @returns
   */
  private getBootAbilities = async (
    tenantId: number,
    systemUserId: number
  ): Promise<IRoleAbility[]> => {
    const { User } = this.tenancy.models(tenantId);

    const tenantUser = await User.query()
      .findOne('systemUserId', systemUserId)
      .withGraphFetched('role.permissions');

    return tenantUser.role.slug === 'admin'
      ? [{ subject: 'all', action: 'manage' }]
      : this.transformRoleAbility(tenantUser.role.permissions);
  };
}
