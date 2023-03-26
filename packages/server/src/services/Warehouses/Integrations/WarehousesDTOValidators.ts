import { Service, Inject } from 'typedi';
import { isEmpty } from 'lodash';
import { ValidateWarehouseExistance } from './ValidateWarehouseExistance';
import { WarehousesSettings } from '../WarehousesSettings';

interface IWarehouseTransactionDTO {
  warehouseId?: number|null;
  entries?: { warehouseId?: number|null }[];
}

@Service()
export class WarehousesDTOValidators {
  @Inject()
  private validateWarehouseExistanceService: ValidateWarehouseExistance;

  @Inject()
  private warehousesSettings: WarehousesSettings;

  /**
   * Validates the warehouse existance of sale invoice transaction.
   * @param {number} tenantId
   * @param {ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO} saleInvoiceDTO
   */
  public validateDTOWarehouseExistance = async (
    tenantId: number,
    DTO: IWarehouseTransactionDTO
  ) => {
    // Validates the sale invoice warehouse id existance.
    this.validateWarehouseExistanceService.validateWarehouseIdExistance(
      DTO,
      DTO.entries
    );
    // Validate the sale invoice warehouse existance on the storage.
    if (DTO.warehouseId) {
      this.validateWarehouseExistanceService.validateWarehouseExistance(
        tenantId,
        DTO.warehouseId
      );
    }
    // Validate the sale invoice entries warehouses existance on the storage.
    if (!isEmpty(DTO.entries)) {
      await this.validateWarehouseExistanceService.validateItemEntriesWarehousesExistance(
        tenantId,
        DTO.entries
      );
    }
  };

  /**
   * Validate the warehouse existance of
   * @param   {number} tenantId
   * @param   {IWarehouseTransactionDTO} saleInvoiceDTO
   * @returns
   */
  public validateDTOWarehouseWhenActive = async (
    tenantId: number,
    DTO: IWarehouseTransactionDTO
  ): Promise<void> => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive(tenantId);

    // Can't continue if the multi-warehouses feature is inactive.
    if (!isActive) return;

    return this.validateDTOWarehouseExistance(tenantId, DTO);
  };
}
