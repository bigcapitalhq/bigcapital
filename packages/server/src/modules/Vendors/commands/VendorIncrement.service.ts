import { Inject, Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Vendor } from '../models/Vendor';

const VENDORS_SETTINGS_GROUP = 'vendors';
const MAX_CODE_ATTEMPTS = 1000;

@Injectable()
export class VendorIncrement {
  /**
   * @param {AutoIncrementOrdersService} autoIncrementOrdersService - Auto increment orders service.
   * @param {TenantModelProxy<typeof Vendor>} vendorModel - Vendor model.
   */
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Retrieves the next available vendor code.
   * @returns {Promise<string>}
   */
  public async getNextVendorCode(): Promise<string> {
    const autoIncrement =
      await this.autoIncrementOrdersService.autoIncrementEnabled(
        VENDORS_SETTINGS_GROUP,
      );

    if (!autoIncrement) {
      return '';
    }
    let code = await this.autoIncrementOrdersService.getNextTransactionNumber(
      VENDORS_SETTINGS_GROUP,
    );
    let attempts = 0;

    // Skip codes that are already used by other vendors.
    while (code && (await this.vendorModel().query().findOne('code', code))) {
      await this.autoIncrementOrdersService.incrementSettingsNextNumber(
        VENDORS_SETTINGS_GROUP,
      );
      code = await this.autoIncrementOrdersService.getNextTransactionNumber(
        VENDORS_SETTINGS_GROUP,
      );
      attempts += 1;

      if (attempts >= MAX_CODE_ATTEMPTS) {
        break;
      }
    }
    return code;
  }

  /**
   * Increments the next vendor code.
   * @returns {Promise<void>}
   */
  public async incrementNextVendorCode(): Promise<void> {
    await this.autoIncrementOrdersService.incrementSettingsNextNumber(
      VENDORS_SETTINGS_GROUP,
    );
  }
}
