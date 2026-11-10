import { Features } from '@/common/types/Features';
import { IFeatureConfiugration } from '@/common/types/Features';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeaturesConfigure {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get the feature configure.
   * @returns {IFeatureConfiugration[]}
   */

  getConfigure(): IFeatureConfiugration[] {
    return [
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
        // Plaid is available once its API credentials are configured.
        name: Features.BankSyncingPlaid,
        defaultValue: Boolean(
          this.configService.get('plaid.clientId') &&
            this.configService.get('plaid.secret'),
        ),
      },
      {
        // SimpleFIN needs no server credentials, only the enabled flag.
        name: Features.BankSyncingSimpleFin,
        defaultValue: this.configService.get('simplefin.enabled') ?? true,
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
  }
}
