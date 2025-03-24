import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ConfigService } from '@nestjs/config';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { IFeatureAllItem } from '@/common/types/Features';
import { Inject } from '@nestjs/common';
import { TenantUser } from '../Tenancy/TenancyModels/models/TenantUser.model';

interface IRoleAbility {
  subject: string;
  ability: string;
}

interface IDashboardBootMeta {
  abilities: IRoleAbility[];
  features: IFeatureAllItem[];
  isBigcapitalCloud: boolean;
}

export class DashboardService {
  constructor(
    private readonly featuresManager: FeaturesManager,
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,

    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
  ) {}

  /**
   * Retrieve dashboard meta.
   * @param {number} tenantId
   * @param {number} authorizedUser
   */
  public getBootMeta = async (): Promise<IDashboardBootMeta> => {
    // Retrieves all orgnaization abilities.
    const abilities = await this.getBootAbilities();

    // Retrieves all organization features.
    const features = await this.featuresManager.all();

    return {
      abilities,
      features,
      isBigcapitalCloud: this.configService.get('hostedOnBigcapitalCloud'),
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
  private getBootAbilities = async (): Promise<IRoleAbility[]> => {
    const authorizedUser = await this.tenancyContext.getSystemUser();

    const tenantUser = await this.tenantUserModel().query()
      .findOne('systemUserId', authorizedUser.id)
      .withGraphFetched('role.permissions');

    return tenantUser.role.slug === 'admin'
      ? [{ subject: 'all', action: 'manage' }]
      : this.transformRoleAbility(tenantUser.role.permissions);
  };
}
