import { Knex } from 'knex';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import { GetVendorCreditService } from './queries/GetVendorCredit.service';
import { IVendorCreditEditDTO, IVendorCreditsQueryDTO } from './types/VendorCredit.types';
import { IVendorCreditCreateDTO } from './types/VendorCredit.types';
import { Injectable } from '@nestjs/common';
import { OpenVendorCreditService } from './commands/OpenVendorCredit.service';
import { GetVendorCreditsService } from './queries/GetVendorCredits.service';

@Injectable()
export class VendorCreditsApplicationService {
  /**
   * @param {CreateVendorCreditService} createVendorCreditService - Create vendor credit service.
   * @param {EditVendorCreditService} editVendorCreditService - Edit vendor credit service.
   * @param {DeleteVendorCreditService} deleteVendorCreditService - Delete vendor credit service.
   * @param {GetVendorCreditService} getVendorCreditService - Get vendor credit service.
   */
  constructor(
    private readonly createVendorCreditService: CreateVendorCreditService,
    private readonly editVendorCreditService: EditVendorCreditService,
    private readonly deleteVendorCreditService: DeleteVendorCreditService,
    private readonly getVendorCreditService: GetVendorCreditService,
    private readonly openVendorCreditService: OpenVendorCreditService,
    private readonly getVendorCreditsService: GetVendorCreditsService,
  ) {}

  /**
   * Creates a new vendor credit.
   * @param {IVendorCreditCreateDTO} dto - The vendor credit create DTO.
   * @param {Knex.Transaction} trx - The transaction.
   * @returns {Promise<VendorCredit>} The created vendor credit.
   */
  createVendorCredit(dto: IVendorCreditCreateDTO, trx?: Knex.Transaction) {
    return this.createVendorCreditService.newVendorCredit(dto, trx);
  }

  /**
   * Opens the given vendor credit.
   * @param {number} vendorCreditId - The vendor credit id.
   * @returns {Promise<VendorCredit>} The opened vendor credit.
   */
  openVendorCredit(vendorCreditId: number) {
    return this.openVendorCreditService.openVendorCredit(vendorCreditId);
  }

  /**
   * Edits the given vendor credit.
   * @param {number} vendorCreditId - The vendor credit id.
   * @param {IVendorCreditEditDTO} dto - The vendor credit edit DTO.
   * @param {Knex.Transaction} trx - The transaction.
   * @returns {Promise<VendorCredit>} The edited vendor credit.
   */
  editVendorCredit(
    vendorCreditId: number,
    dto: IVendorCreditEditDTO,
    trx?: Knex.Transaction,
  ) {
    return this.editVendorCreditService.editVendorCredit(
      vendorCreditId,
      dto,
      trx,
    );
  }

  /**
   * Deletes the given vendor credit.
   * @param {number} vendorCreditId - The vendor credit id.
   * @param {Knex.Transaction} trx - The transaction.
   * @returns {Promise<VendorCredit>} The deleted vendor credit.
   */
  deleteVendorCredit(vendorCreditId: number, trx?: Knex.Transaction) {
    return this.deleteVendorCreditService.deleteVendorCredit(
      vendorCreditId,
      trx,
    );
  }

  getVendorCredit(vendorCreditId: number, trx?: Knex.Transaction) {
    return this.getVendorCreditService.getVendorCredit(vendorCreditId, trx);
  }

  /**
   * Retrieves the paginated filterable vendor credits list.
   * @param {IVendorCreditsQueryDTO} query 
   * @returns {}
   */
  getVendorCredits(query: IVendorCreditsQueryDTO) {
    return this.getVendorCreditsService.getVendorCredits(query);
  }
}
