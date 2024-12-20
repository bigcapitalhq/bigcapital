import { CreateWarehouse } from './CreateWarehouse.service';
import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CreateInitialWarehouse {
  /**
   * @param {CreateWarehouse} createWarehouse - Create warehouse service.
   * @param {I18nContext} i18n - I18n context.
   */
  constructor(
    private readonly createWarehouse: CreateWarehouse,
    private readonly i18n: I18nContext,
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
