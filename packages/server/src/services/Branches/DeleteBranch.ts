import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import { IBranchDeletedPayload, IBranchDeletePayload } from '@/interfaces';
import { CURDBranch } from './CRUDBranch';
import { BranchValidator } from './BranchValidate';
import { ERRORS } from './constants';
@Service()
export class DeleteBranch extends CURDBranch {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private validator: BranchValidator;

  /**
   * Validates the branch deleting.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<void>}
   */
  private authorize = async (tenantId: number, branchId: number) => {
    await this.validator.validateBranchNotOnlyWarehouse(tenantId, branchId);
  };

  /**
   * Deletes branch.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<void>}
   */
  public deleteBranch = async (
    tenantId: number,
    branchId: number
  ): Promise<void> => {
    const { Branch } = this.tenancy.models(tenantId);

    // Retrieves the old branch or throw not found service error.
    const oldBranch = await Branch.query()
      .findById(branchId)
      .throwIfNotFound()
      .queryAndThrowIfHasRelations({
        type: ERRORS.BRANCH_HAS_ASSOCIATED_TRANSACTIONS,
      });
    // Authorize the branch before deleting.
    await this.authorize(tenantId, branchId);

    // Deletes branch under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBranchCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        tenantId,
        oldBranch,
        trx,
      } as IBranchDeletePayload);

      await Branch.query().findById(branchId).delete();

      // Triggers `onBranchCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        tenantId,
        oldBranch,
        trx,
      } as IBranchDeletedPayload);
    });
  };
}
