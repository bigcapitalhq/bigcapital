import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { CURDBranch } from './CRUDBranch';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  IBranch,
  IBranchMarkAsPrimaryPayload,
  IBranchMarkedAsPrimaryPayload,
} from '@/interfaces';

@Service()
export class MarkBranchAsPrimary extends CURDBranch {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Marks the given branch as primary.
   * @param   {number} tenantId
   * @param   {number} branchId
   * @returns {Promise<IBranch>}
   */
  public markAsPrimary = async (
    tenantId: number,
    branchId: number
  ): Promise<IBranch> => {
    const { Branch } = this.tenancy.models(tenantId);

    // Retrieves the old branch or throw not found service error.
    const oldBranch = await this.getBranchOrThrowNotFound(tenantId, branchId);

    // Updates the branches under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBranchMarkPrimary` event.
      await this.eventPublisher.emitAsync(events.branch.onMarkPrimary, {
        tenantId,
        oldBranch,
        trx,
      } as IBranchMarkAsPrimaryPayload);

      // Updates all branches as not primary.
      await Branch.query(trx).update({ primary: false });

      // Updates the given branch as primary.
      const markedBranch = await Branch.query(trx).patchAndFetchById(branchId, {
        primary: true,
      });
      // Triggers `onBranchMarkedPrimary` event.
      await this.eventPublisher.emitAsync(events.branch.onMarkedPrimary, {
        tenantId,
        markedBranch,
        oldBranch,
        trx,
      } as IBranchMarkedAsPrimaryPayload);

      return markedBranch;
    });
  };
}
