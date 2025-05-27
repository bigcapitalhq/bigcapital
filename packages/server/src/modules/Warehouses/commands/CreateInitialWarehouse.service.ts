import { CreateWarehouse } from './CreateWarehouse.service';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CreateInitialWarehouse {
  /**
   * @param {CreateWarehouse} createWarehouse - Create warehouse service.
   * @param {I18nService} i18n - I18n service.
   */
  constructor(
    private readonly createWarehouse: CreateWarehouse,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Creates a initial warehouse.
   * @param {number} tenantId
   */
  public createInitialWarehouse = async () => {
    return this.createWarehouse.createWarehouse({
      name: this.i18n.t('warehouses.primary_warehouse'),
      code: '10001',
      primary: true,
    });
  };
}
