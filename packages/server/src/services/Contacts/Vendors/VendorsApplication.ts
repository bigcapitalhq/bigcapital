import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ISystemUser,
  IVendorEditDTO,
  IVendorNewDTO,
  IVendorOpeningBalanceEditDTO,
  IVendorsFilter,
} from '@/interfaces';
import { CreateVendor } from './CRUD/CreateVendor';
import { DeleteVendor } from './CRUD/DeleteVendor';
import { EditOpeningBalanceVendor } from './CRUD/EditOpeningBalanceVendor';
import { EditVendor } from './CRUD/EditVendor';
import { GetVendor } from './CRUD/GetVendor';
import { GetVendors } from './CRUD/GetVendors';

@Service()
export class VendorsApplication {
  @Inject()
  private createVendorService: CreateVendor;

  @Inject()
  private editVendorService: EditVendor;

  @Inject()
  private deleteVendorService: DeleteVendor;

  @Inject()
  private editOpeningBalanceService: EditOpeningBalanceVendor;

  @Inject()
  private getVendorService: GetVendor;

  @Inject()
  private getVendorsService: GetVendors;

  /**
   * Creates a new vendor.
   * @param  {number} tenantId
   * @param  {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public createVendor = (
    tenantId: number,
    vendorDTO: IVendorNewDTO,
    trx?: Knex.Transaction
  ) => {
    return this.createVendorService.createVendor(tenantId, vendorDTO, trx);
  };

  /**
   * Edits details of the given vendor.
   * @param   {number} tenantId -
   * @param   {number} vendorId -
   * @param   {IVendorEditDTO} vendorDTO -
   * @returns {Promise<IVendor>}
   */
  public editVendor = (
    tenantId: number,
    vendorId: number,
    vendorDTO: IVendorEditDTO,
    authorizedUser: ISystemUser
  ) => {
    return this.editVendorService.editVendor(
      tenantId,
      vendorId,
      vendorDTO,
      authorizedUser
    );
  };

  /**
   * Deletes the given vendor.
   * @param  {number} tenantId
   * @param  {number} vendorId
   * @return {Promise<void>}
   */
  public deleteVendor = (
    tenantId: number,
    vendorId: number,
    authorizedUser: ISystemUser
  ) => {
    return this.deleteVendorService.deleteVendor(
      tenantId,
      vendorId,
      authorizedUser
    );
  };

  /**
   * Changes the opening balance of the given customer.
   * @param   {number} tenantId
   * @param   {number} customerId
   * @param   {number} openingBalance
   * @param   {string|Date} openingBalanceAt
   * @returns {Promise<IVendor>}
   */
  public editOpeningBalance = (
    tenantId: number,
    vendorId: number,
    openingBalanceEditDTO: IVendorOpeningBalanceEditDTO
  ) => {
    return this.editOpeningBalanceService.editOpeningBalance(
      tenantId,
      vendorId,
      openingBalanceEditDTO
    );
  };

  /**
   * Retrieves the vendor details.
   * @param   {number} tenantId
   * @param   {number} vendorId
   * @returns
   */
  public getVendor = (tenantId: number, vendorId: number) => {
    return this.getVendorService.getVendor(tenantId, vendorId);
  };

  /**
   * Retrieves the vendors paginated list.
   * @param   {number} tenantId
   * @param   {IVendorsFilter} filterDTO
   * @returns
   */
  public getVendors = (tenantId: number, filterDTO: IVendorsFilter) => {
    return this.getVendorsService.getVendorsList(tenantId, filterDTO);
  };
}
