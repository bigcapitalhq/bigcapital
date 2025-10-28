import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IBranchEditedPayload, IBranchEditPayload } from '../Branches.types';
import { Branch } from '../models/Branch.model';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditBranchDto } from '../dtos/Branch.dto';

@Injectable()
export class EditBranchService {
  constructor(
    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
  ) {}

  /**
   * Edits branch.
   * @param {number} branchId - Branch id.
   * @param {IEditBranchDTO} editBranchDTO - Edit branch data.
   */
  public editBranch = async (
    branchId: number,
    editBranchDTO: EditBranchDto,
  ) => {
    // Retrieves the old branch or throw not found service error.
    const oldBranch = await this.branchModel()
      .query()
      .findById(branchId)
      .throwIfNotFound();

    // Deletes branch under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBranchEdit` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        oldBranch,
        trx,
      } as IBranchEditPayload);

      // Edits the branch on the storage.
      const branch = await this.branchModel()
        .query()
        .patchAndFetchById(branchId, {
          ...editBranchDTO,
        });

      // Triggers `onBranchEdited` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        oldBranch,
        branch,
        trx,
      } as IBranchEditedPayload);

      return branch;
    });
  };
}
