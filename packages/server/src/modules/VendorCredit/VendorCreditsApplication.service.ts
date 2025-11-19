import { Knex } from 'knex';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import { GetVendorCreditService } from './queries/GetVendorCredit.service';
import {
  IVendorCreditEditDTO,
  IVendorCreditsQueryDTO,
} from './types/VendorCredit.types';
import { IVendorCreditCreateDTO } from './types/VendorCredit.types';
import { Injectable } from '@nestjs/common';
import { OpenVendorCreditService } from './commands/OpenVendorCredit.service';
import { GetVendorCreditsService } from './queries/GetVendorCredits.service';
import {
  CreateVendorCreditDto,
  EditVendorCreditDto,
} from './dtos/VendorCredit.dto';
import { BulkDeleteVendorCreditsService } from './BulkDeleteVendorCredits.service';
import { ValidateBulkDeleteVendorCreditsService } from './ValidateBulkDeleteVendorCredits.service';
import { ValidateBulkDeleteResponseDto } from '@/common/dtos/BulkDelete.dto';

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
    private readonly bulkDeleteVendorCreditsService: BulkDeleteVendorCreditsService,
    private readonly validateBulkDeleteVendorCreditsService: ValidateBulkDeleteVendorCreditsService,
  ) { }

  /**
   * Creates a new vendor credit.
   * @param {CreateVendorCreditDto} dto - The vendor credit create DTO.
   * @param {Knex.Transaction} trx - The transaction.
   * @returns {Promise<VendorCredit>} The created vendor credit.
   */
  createVendorCredit(dto: CreateVendorCreditDto, trx?: Knex.Transaction) {
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
   * @param {EditVendorCreditDto} dto - The vendor credit edit DTO.
   * @param {Knex.Transaction} trx - The transaction.
   * @returns {Promise<VendorCredit>} The edited vendor credit.
   */
  editVendorCredit(
    vendorCreditId: number,
    dto: EditVendorCreditDto,
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

  bulkDeleteVendorCredits(
    vendorCreditIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteVendorCreditsService.bulkDeleteVendorCredits(
      vendorCreditIds,
      options,
    );
  }

  validateBulkDeleteVendorCredits(
    vendorCreditIds: number[],
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.validateBulkDeleteVendorCreditsService.validateBulkDeleteVendorCredits(
      vendorCreditIds,
    );
  }
}
