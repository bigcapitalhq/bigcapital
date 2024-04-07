import { IBranchEditPayload, IBranchEditedPayload, IEditBranchDTO } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CURDBranch } from './CRUDBranch';

@Service()
export class EditBranch extends CURDBranch {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Edits branch.
   * @param {number} tenantId
   * @param {number} branchId
   * @param editBranchDTO
   */
  public editBranch = async (tenantId: number, branchId: number, editBranchDTO: IEditBranchDTO) => {
    const { Branch } = this.tenancy.models(tenantId);

    // Retrieves the old branch or throw not found service error.
    const oldBranch = await this.getBranchOrThrowNotFound(tenantId, branchId);

    // Deletes branch under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBranchEdit` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        tenantId,
        oldBranch,
        trx,
      } as IBranchEditPayload);

      // Edits the branch on the storage.
      const branch = await Branch.query().patchAndFetchById(branchId, {
        ...editBranchDTO,
      });
      // Triggers `onBranchEdited` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        tenantId,
        oldBranch,
        branch,
        trx,
      } as IBranchEditedPayload);

      return branch;
    });
  };
}
