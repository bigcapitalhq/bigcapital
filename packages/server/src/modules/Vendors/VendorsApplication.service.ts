import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateVendorService } from './commands/CreateVendor.service';
import { EditVendorService } from './commands/EditVendor.service';
import { DeleteVendorService } from './commands/DeleteVendor.service';
import { EditOpeningBalanceVendorService } from './commands/EditOpeningBalanceVendor.service';
import { GetVendorService } from './queries/GetVendor';
import { VendorOpeningBalanceEditDto } from './dtos/VendorOpeningBalanceEdit.dto';
import { GetVendorsService } from './queries/GetVendors.service';
import { CreateVendorDto } from './dtos/CreateVendor.dto';
import { EditVendorDto } from './dtos/EditVendor.dto';
import { GetVendorsQueryDto } from './dtos/GetVendorsQuery.dto';
import { BulkDeleteVendorsService } from './BulkDeleteVendors.service';
import { ValidateBulkDeleteVendorsService } from './ValidateBulkDeleteVendors.service';

@Injectable()
export class VendorsApplication {
  constructor(
    private createVendorService: CreateVendorService,
    private editVendorService: EditVendorService,
    private deleteVendorService: DeleteVendorService,
    private editOpeningBalanceService: EditOpeningBalanceVendorService,
    private getVendorService: GetVendorService,
    private getVendorsService: GetVendorsService,
    private readonly bulkDeleteVendorsService: BulkDeleteVendorsService,
    private readonly validateBulkDeleteVendorsService: ValidateBulkDeleteVendorsService,
  ) {}

  /**
   * Creates a new vendor.
   * @param  {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public createVendor(vendorDTO: CreateVendorDto, trx?: Knex.Transaction) {
    return this.createVendorService.createVendor(vendorDTO, trx);
  }

  /**
   * Edits details of the given vendor.
   * @param {number} vendorId -
   * @param {IVendorEditDTO} vendorDTO -
   * @returns {Promise<IVendor>}
   */
  public editVendor(vendorId: number, vendorDTO: EditVendorDto) {
    return this.editVendorService.editVendor(vendorId, vendorDTO);
  }

  /**
   * Deletes the given vendor.
   * @param {number} vendorId
   * @return {Promise<void>}
   */
  public deleteVendor(vendorId: number) {
    return this.deleteVendorService.deleteVendor(vendorId);
  }

  /**
   * Changes the opening balance of the given vendor.
   * @param {number} vendorId
   * @param  {VendorOpeningBalanceEditDto} openingBalanceEditDTO
   * @returns {Promise<IVendor>}
   */
  public editOpeningBalance(
    vendorId: number,
    openingBalanceEditDTO: VendorOpeningBalanceEditDto,
  ) {
    return this.editOpeningBalanceService.editOpeningBalance(
      vendorId,
      openingBalanceEditDTO,
    );
  }

  /**
   * Retrieves the vendor details.
   * @param {number} vendorId - Vendor ID.
   * @returns
   */
  public getVendor(vendorId: number) {
    return this.getVendorService.getVendor(vendorId);
  }

  /**
   * Retrieves the vendors paginated list.
   * @param {Partial<IVendorsFilter>} filterDTO
   * @returns {Promise<{ vendors: Vendor[], pagination: IPaginationMeta, filterMeta: IFilterMeta }>>}
   */
  public getVendors(filterDTO: GetVendorsQueryDto) {
    return this.getVendorsService.getVendorsList(filterDTO);
  }

  public bulkDeleteVendors(
    vendorIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteVendorsService.bulkDeleteVendors(vendorIds, options);
  }

  public validateBulkDeleteVendors(vendorIds: number[]) {
    return this.validateBulkDeleteVendorsService.validateBulkDeleteVendors(
      vendorIds,
    );
  }
}
