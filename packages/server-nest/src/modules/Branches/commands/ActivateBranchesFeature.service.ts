import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERRORS } from '../constants';
import {
  IBranchesActivatedPayload,
  IBranchesActivatePayload,
} from '../Branches.types';
import { CreateBranchService } from './CreateBranch.service';
import { BranchesSettingsService } from '../BranchesSettings';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Branch } from '../models/Branch.model';
import { events } from '@/common/events/events';

@Injectable()
export class ActivateBranches {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly createBranch: CreateBranchService,
    private readonly branchesSettings: BranchesSettingsService,
    private readonly i18n: I18nService,

    @Inject(Branch.name)
    private readonly branchModel: typeof Branch,
  ) {}

  /**
   * Throws service error if multi-branches feature is already activated.
   */
  private throwIfMultiBranchesActivated = (isActivated: boolean) => {
    if (isActivated) {
      throw new ServiceError(ERRORS.MUTLI_BRANCHES_ALREADY_ACTIVATED);
    }
  };

  /**
   * Creates a new initial branch.
   */
  private createInitialBranch = () => {
    return this.createBranch.createBranch({
      name: this.i18n.t('branches.head_branch'),
      code: '10001',
      primary: true,
    });
  };

  /**
   * Activate multi-branches feature.
   * @returns {Promise<void>}
   */
  public activateBranches = (): Promise<void> => {
    const isActivated = this.branchesSettings.isMultiBranchesActive();

    // Throw error if mutli-branches is already activated.
    this.throwIfMultiBranchesActivated(isActivated);

    // Activate multi-branches under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBranchActivate` branch.
      await this.eventPublisher.emitAsync(events.branch.onActivate, {
        trx,
      } as IBranchesActivatePayload);

      // Create a new branch as primary branch.
      const primaryBranch = await this.createInitialBranch();

      // Mark the mutli-branches is activated.
      await this.branchesSettings.markMultiBranchesAsActivated();

      // Triggers `onBranchActivated` branch.
      await this.eventPublisher.emitAsync(events.branch.onActivated, {
        primaryBranch,
        trx,
      } as IBranchesActivatedPayload);
    });
  };
}
