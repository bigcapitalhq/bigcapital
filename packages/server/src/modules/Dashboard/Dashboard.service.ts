import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { FeaturesManager } from '../Features/FeaturesManager';
import { ConfigService } from '@nestjs/config';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { IFeatureAllItem } from '@/common/types/Features';
import { TenantUser } from '../Tenancy/TenancyModels/models/TenantUser.model';
import { ExtensionManager } from '@/extensions/extension.manager';
import { ExtensionContributionRegistry } from '@/extensions/extension.registry';
import { ExtensionSettingsService } from '@/extensions/settings/extension-settings.service';

interface IRoleAbility {
  subject: string;
  action: string;
}

interface IDashboardBootExtension {
  id: string;
  version: string;
  settings?: Record<string, unknown>;
}

interface IDashboardBootMeta {
  abilities: IRoleAbility[];
  features: IFeatureAllItem[];
  extensions: IDashboardBootExtension[];
  isBigcapitalCloud: boolean;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly featuresManager: FeaturesManager,
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,
    private readonly cls: ClsService,

    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,

    @Optional()
    private readonly extensionManager?: ExtensionManager,

    @Optional()
    private readonly extensionRegistry?: ExtensionContributionRegistry,

    @Optional()
    private readonly extensionSettings?: ExtensionSettingsService,
  ) {}

  /**
   * Retrieve dashboard meta.
   */
  public getBootMeta = async (): Promise<IDashboardBootMeta> => {
    // Retrieves all orgnaization abilities.
    const abilities = await this.getBootAbilities();

    // Retrieves all organization features.
    const features = await this.featuresManager.all();

    // Retrieves the extensions enabled for the current organization.
    const extensions = await this.getBootExtensions();

    return {
      abilities,
      features,
      extensions,
      isBigcapitalCloud: this.configService.get('hostedOnBigcapitalCloud'),
    };
  };

  /**
   * Retrieves the enabled extensions and their public settings.
   */
  private getBootExtensions = async (): Promise<IDashboardBootExtension[]> => {
    if (!this.extensionManager) {
      return [];
    }

    const organizationId = this.cls.get<string>('organizationId');

    if (!organizationId) {
      return [];
    }

    const extensions =
      await this.extensionManager.listForOrganization(organizationId);

    return extensions
      .filter((extension) => extension.enabled)
      .map((extension) => ({
        id: extension.id,
        version: extension.version,
        settings: this.getPublicExtensionSettings(
          extension.id,
          extension.settings,
        ),
      }));
  };

  /**
   * Keeps only settings explicitly marked as public in the manifest.
   */
  private getPublicExtensionSettings(
    extensionId: string,
    settings?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (this.extensionSettings) {
      return this.extensionSettings.getPublicSettings(extensionId, settings);
    }

    if (!settings) {
      return undefined;
    }

    const definitions = this.extensionRegistry?.getSettings(extensionId) ?? [];

    const publicKeys = new Set(
      definitions
        .filter(
          ({ definition }) => definition.public && definition.type !== 'secret',
        )
        .map(({ key }) => key),
    );

    const publicSettings = Object.fromEntries(
      Object.entries(settings).filter(([key]) => publicKeys.has(key)),
    );

    return Object.keys(publicSettings).length > 0 ? publicSettings : undefined;
  }

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
   * @returns {Promise<IRoleAbility[]>}
   */
  private getBootAbilities = async (): Promise<IRoleAbility[]> => {
    const authorizedUser = await this.tenancyContext.getSystemUser();

    const tenantUser = await this.tenantUserModel()
      .query()
      .findOne('systemUserId', authorizedUser.id)
      .withGraphFetched('role.permissions')
      .throwIfNotFound();

    return tenantUser.role.slug === 'admin'
      ? [{ subject: 'all', action: 'manage' }]
      : this.transformRoleAbility(tenantUser.role.permissions);
  };
}
