import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IBranchCreatedPayload,
  IBranchCreatePayload,
  ICreateBranchDTO,
} from '../Branches.types';
import { BranchCommandValidator } from './BranchCommandValidator.service';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Branch } from '../models/Branch.model';
import { events } from '@/common/events/events';

@Injectable()
export class CreateBranchService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly validator: BranchCommandValidator,

    @Inject(Branch.name)
    private readonly branchModel: typeof Branch,
  ) {}

  /**
   * Creates a new branch.
   * @param {ICreateBranchDTO} createBranchDTO
   * @returns {Promise<IBranch>}
   */
  public createBranch = async (
    createBranchDTO: ICreateBranchDTO,
  ): Promise<Branch> => {
    // Creates a new branch under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBranchCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        createBranchDTO,
        trx,
      } as IBranchCreatePayload);

      const branch = await this.branchModel.query().insertAndFetch({
        ...createBranchDTO,
      });

      // Triggers `onBranchCreated` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        createBranchDTO,
        branch,
        trx,
      } as IBranchCreatedPayload);

      return branch;
    });
  };
}
