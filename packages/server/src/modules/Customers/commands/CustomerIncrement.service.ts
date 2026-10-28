import { Inject, Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Customer } from '../models/Customer';

const CUSTOMERS_SETTINGS_GROUP = 'customers';
const MAX_CODE_ATTEMPTS = 1000;

@Injectable()
export class CustomerIncrement {
  /**
   * @param {AutoIncrementOrdersService} autoIncrementOrdersService - Auto increment orders service.
   * @param {TenantModelProxy<typeof Customer>} customerModel - Customer model.
   */
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Retrieves the next available customer code.
   * @returns {Promise<string>}
   */
  public async getNextCustomerCode(): Promise<string> {
    const autoIncrement =
      await this.autoIncrementOrdersService.autoIncrementEnabled(
        CUSTOMERS_SETTINGS_GROUP,
      );

    if (!autoIncrement) {
      return '';
    }
    let code = await this.autoIncrementOrdersService.getNextTransactionNumber(
      CUSTOMERS_SETTINGS_GROUP,
    );
    let attempts = 0;

    // Skip codes that are already used by other customers.
    while (code && (await this.customerModel().query().findOne('code', code))) {
      await this.autoIncrementOrdersService.incrementSettingsNextNumber(
        CUSTOMERS_SETTINGS_GROUP,
      );
      code = await this.autoIncrementOrdersService.getNextTransactionNumber(
        CUSTOMERS_SETTINGS_GROUP,
      );
      attempts += 1;

      if (attempts >= MAX_CODE_ATTEMPTS) {
        break;
      }
    }
    return code;
  }

  /**
   * Increments the next customer code.
   * @returns {Promise<void>}
   */
  public async incrementNextCustomerCode(): Promise<void> {
    await this.autoIncrementOrdersService.incrementSettingsNextNumber(
      CUSTOMERS_SETTINGS_GROUP,
    );
  }
}
