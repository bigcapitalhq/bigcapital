import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IBranchMarkAsPrimaryPayload,
  IBranchMarkedAsPrimaryPayload,
} from '../Branches.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { Branch } from '../models/Branch.model';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class MarkBranchAsPrimaryService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Marks the given branch as primary.
   * @param   {number} branchId
   * @returns {Promise<IBranch>}
   */
  public async markAsPrimary(branchId: number): Promise<Branch> {
    // Retrieves the old branch or throw not found service error.
    const oldBranch = await this.branchModel()
      .query()
      .findById(branchId)
      .throwIfNotFound();

    // Updates the branches under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBranchMarkPrimary` event.
      await this.eventPublisher.emitAsync(events.branch.onMarkPrimary, {
        oldBranch,
        trx,
      } as IBranchMarkAsPrimaryPayload);

      // Updates all branches as not primary.
      await this.branchModel().query(trx).update({ primary: false });

      // Updates the given branch as primary.
      const markedBranch = await this.branchModel()
        .query(trx)
        .patchAndFetchById(branchId, {
          primary: true,
        });

      // Triggers `onBranchMarkedPrimary` event.
      await this.eventPublisher.emitAsync(events.branch.onMarkedPrimary, {
        markedBranch,
        oldBranch,
        trx,
      } as IBranchMarkedAsPrimaryPayload);

      return markedBranch;
    });
  }
}
