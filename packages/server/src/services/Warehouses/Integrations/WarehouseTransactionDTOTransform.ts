import { omit } from 'lodash';
import { Inject, Service } from 'typedi';
import { WarehousesSettings } from '../WarehousesSettings';

@Service()
export class WarehouseTransactionDTOTransform {
  @Inject()
  private warehousesSettings: WarehousesSettings;

  /**
   * Excludes DTO warehouse id when mutli-warehouses feature is inactive.
   * @param   {number} tenantId
   * @returns {Promise<Omit<T, 'warehouseId'> | T>}
   */
  private excludeDTOWarehouseIdWhenInactive = <T extends { warehouseId?: number }>(
    tenantId: number,
    DTO: T,
  ): Omit<T, 'warehouseId'> | T => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive(tenantId);

    return !isActive ? omit(DTO, ['warehouseId']) : DTO;
  };

  /**
   *
   * @param   {number} tenantId
   * @param   {T} DTO -
   * @returns {Omit<T, 'warehouseId'> | T}
   */
  public transformDTO =
    <T extends { warehouseId?: number }>(tenantId: number) =>
    (DTO: T): Omit<T, 'warehouseId'> | T => {
      return this.excludeDTOWarehouseIdWhenInactive<T>(tenantId, DTO);
    };
}
