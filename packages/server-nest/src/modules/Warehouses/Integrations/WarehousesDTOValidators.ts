import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ValidateWarehouseExistance } from './ValidateWarehouseExistance';
import { WarehousesSettings } from '../WarehousesSettings';

interface IWarehouseTransactionDTO {
  warehouseId?: number | null;
  entries?: { warehouseId?: number | null }[];
}

@Injectable()
export class WarehousesDTOValidators {
  constructor(
    private readonly validateWarehouseExistanceService: ValidateWarehouseExistance,
    private readonly warehousesSettings: WarehousesSettings,
  ) {}

  /**
   * Validates the warehouse existance of sale invoice transaction.
   * @param {IWarehouseTransactionDTO} DTO
   */
  public validateDTOWarehouseExistance = async (DTO: IWarehouseTransactionDTO) => {
    // Validates the sale invoice warehouse id existance.
    this.validateWarehouseExistanceService.validateWarehouseIdExistance(
      DTO,
      DTO.entries,
    );
    // Validate the sale invoice warehouse existance on the storage.
    if (DTO.warehouseId) {
      this.validateWarehouseExistanceService.validateWarehouseExistance(
        DTO.warehouseId,
      );
    }
    // Validate the sale invoice entries warehouses existance on the storage.
    if (!isEmpty(DTO.entries)) {
      await this.validateWarehouseExistanceService.validateItemEntriesWarehousesExistance(
        DTO.entries,
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
    DTO: IWarehouseTransactionDTO,
  ): Promise<void> => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive();

    // Can't continue if the multi-warehouses feature is inactive.
    if (!isActive) return;

    return this.validateDTOWarehouseExistance(DTO);
  };
}
