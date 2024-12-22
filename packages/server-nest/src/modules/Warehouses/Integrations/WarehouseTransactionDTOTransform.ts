import { omit } from 'lodash';
import { Injectable } from '@nestjs/common';
import { WarehousesSettings } from '../WarehousesSettings';

@Injectable()
export class WarehouseTransactionDTOTransform {
  constructor(
    private readonly warehousesSettings: WarehousesSettings,
  ) {}

  /**
   * Excludes DTO warehouse id when mutli-warehouses feature is inactive.
   * @param   {number} tenantId
   * @returns {Promise<Omit<T, 'warehouseId'> | T>}
   */
  private excludeDTOWarehouseIdWhenInactive = <
    T extends { warehouseId?: number }
  >(
    DTO: T
  ): Omit<T, 'warehouseId'> | T => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive();

    return !isActive ? omit(DTO, ['warehouseId']) : DTO;
  };

  /**
   * 
   * @param   {number} tenantId
   * @param   {T} DTO -
   * @returns {Omit<T, 'warehouseId'> | T}
   */
  public transformDTO =
    <T extends { warehouseId?: number }>(DTO: T): Omit<T, 'warehouseId'> | T => {
      return this.excludeDTOWarehouseIdWhenInactive<T>(DTO);
    };
}
 