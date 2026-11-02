import { Features } from '@/common/types/Features';
import { IFeatureConfiugration } from '@/common/types/Features';
import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtensionContributionRegistry } from '@/extensions/extension.registry';

@Injectable()
export class FeaturesConfigure {
  constructor(
    private readonly configService: ConfigService,

    @Optional()
    private readonly extensionRegistry?: ExtensionContributionRegistry,
  ) {}

  /**
   * Get the feature configure.
   *
   * Core features come first; extension features are appended with their
   * namespaced `ext:<extensionId>:<key>` identifiers.
   *
   * @returns {IFeatureConfiugration[]}
   */
  getConfigure(): IFeatureConfiugration[] {
    const coreFeatures: IFeatureConfiugration[] = [
      {
        name: Features.BRANCHES,
        defaultValue: false,
      },
      {
        name: Features.WAREHOUSES,
        defaultValue: false,
      },
      {
        name: Features.BankSyncing,
        defaultValue: this.configService.get('bankfeed.enabled') ?? false,
      },
      {
        name: Features.LANDED_COST,
        defaultValue: false,
      },
      {
        name: Features.SMS_NOTIFICATIONS,
        defaultValue: false,
      },
      {
        name: Features.SALES_TAX,
        defaultValue: true,
      },
      {
        name: Features.TRACKING_CATEGORIES,
        defaultValue: false,
      },
    ];

    const extensionFeatures: IFeatureConfiugration[] = (
      this.extensionRegistry?.getFeatures() ?? []
    ).map((contribution) => ({
      name: contribution.id,
      defaultValue: contribution.definition.defaultValue,
    }));

    return [...coreFeatures, ...extensionFeatures];
  }
}
