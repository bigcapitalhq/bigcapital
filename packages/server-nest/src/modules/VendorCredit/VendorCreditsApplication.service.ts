import { Knex } from 'knex';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import GetVendorCreditService from './queries/GetVendorCredit.service';
import { IVendorCreditEditDTO } from './types/VendorCredit.types';
import { IVendorCreditCreateDTO } from './types/VendorCredit.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorCreditsApplicationService {
  constructor(
    private readonly createVendorCreditService: CreateVendorCreditService,
    private readonly editVendorCreditService: EditVendorCreditService,
    private readonly deleteVendorCreditService: DeleteVendorCreditService,
    private readonly getVendorCreditService: GetVendorCreditService,
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
}
