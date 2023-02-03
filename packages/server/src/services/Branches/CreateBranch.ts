import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  IBranch,
  IBranchCreatedPayload,
  IBranchCreatePayload,
  ICreateBranchDTO,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { BranchValidator } from './BranchValidate';

@Service()
export class CreateBranch {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private validator: BranchValidator;
  
  /**
   * Creates a new branch.
   * @param   {number} tenantId
   * @param   {ICreateBranchDTO} createBranchDTO
   * @returns {Promise<IBranch>}
   */
  public createBranch = (
    tenantId: number,
    createBranchDTO: ICreateBranchDTO
  ): Promise<IBranch> => {
    const { Branch } = this.tenancy.models(tenantId);

    // Creates a new branch under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBranchCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        tenantId,
        createBranchDTO,
        trx,
      } as IBranchCreatePayload);

      const branch = await Branch.query().insertAndFetch({
        ...createBranchDTO,
      });
      // Triggers `onBranchCreated` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        tenantId,
        createBranchDTO,
        branch,
        trx,
      } as IBranchCreatedPayload);

      return branch;
    });
  };
}
