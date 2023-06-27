import { Service, Inject } from 'typedi';
import { isEmpty } from 'lodash';
import { ValidateWarehouseExistence } from './ValidateWarehouseExistence';
import { WarehousesSettings } from '../WarehousesSettings';

interface IWarehouseTransactionDTO {
  warehouseId?: number|null;
  entries?: { warehouseId?: number|null }[];
}

@Service()
export class WarehousesDTOValidators {
  @Inject()
  private validateWarehouseExistenceService: ValidateWarehouseExistence;

  @Inject()
  private warehousesSettings: WarehousesSettings;

  /**
   * Validates the warehouse existence of sale invoice transaction.
   * @param {number} tenantId
   * @param {ISaleInvoiceCreateDTO | ISaleInvoiceEditDTO} saleInvoiceDTO
   */
  public validateDTOWarehouseExistence = async (
    tenantId: number,
    DTO: IWarehouseTransactionDTO
  ) => {
    // Validates the sale invoice warehouse id existence.
    this.validateWarehouseExistenceService.validateWarehouseIdExistence(
      DTO,
      DTO.entries
    );
    // Validate the sale invoice warehouse existence on the storage.
    if (DTO.warehouseId) {
      this.validateWarehouseExistenceService.validateWarehouseExistence(
        tenantId,
        DTO.warehouseId
      );
    }
    // Validate the sale invoice entries warehouses existence on the storage.
    if (!isEmpty(DTO.entries)) {
      await this.validateWarehouseExistenceService.validateItemEntriesWarehousesExistence(
        tenantId,
        DTO.entries
      );
    }
  };

  /**
   * Validate the warehouse existence of
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

    return this.validateDTOWarehouseExistence(tenantId, DTO);
  };
}
