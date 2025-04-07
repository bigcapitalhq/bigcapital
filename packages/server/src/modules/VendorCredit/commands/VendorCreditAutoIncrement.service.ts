import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class VendorCreditAutoIncrementService {
  /**
   * @param {AutoIncrementOrdersService} autoIncrementOrdersService - Auto increment orders service.
   */
  constructor(private autoIncrementOrdersService: AutoIncrementOrdersService) {}

  /**
   * Retrieve the next unique credit number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextCreditNumber = (): Promise<string> => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'vendor_credit',
    );
  };

  /**
   * Increment the vendor credit serial next number.
   */
  public incrementSerialNumber = () => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'vendor_credit',
    );
  };
}
