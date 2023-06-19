import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IBranchesActivatedPayload,
  IBranchesActivatePayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { CreateBranch } from './CreateBranch';
import { BranchesSettings } from './BranchesSettings';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ActivateBranches {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private createBranch: CreateBranch;

  @Inject()
  private branchesSettings: BranchesSettings;

  /**
   * Throws service error if multi-branches feature is already activated.
   * @param {boolean} isActivated
   */
  private throwIfMultiBranchesActivated = (isActivated: boolean) => {
    if (isActivated) {
      throw new ServiceError(ERRORS.MUTLI_BRANCHES_ALREADY_ACTIVATED);
    }
  };

  /**
   * Creates a new initial branch.
   * @param {number} tenantId
   */
  private createInitialBranch = (tenantId: number) => {
    const { __ } = this.tenancy.i18n(tenantId);

    return this.createBranch.createBranch(tenantId, {
      name: __('branches.head_branch'),
      code: '10001',
      primary: true,
    });
  };

  /**
   * Activate multi-branches feature.
   * @param   {number} tenantId
   * @returns {Promise<void>}
   */
  public activateBranches = (tenantId: number): Promise<void> => {
    const isActivated = this.branchesSettings.isMultiBranchesActive(tenantId);

    // Throw error if mutli-branches is already activated.
    this.throwIfMultiBranchesActivated(isActivated);

    // Activate multi-branches under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBranchActivate` branch.
      await this.eventPublisher.emitAsync(events.branch.onActivate, {
        tenantId,
        trx,
      } as IBranchesActivatePayload);

      // Create a new branch as primary branch.
      const primaryBranch = await this.createInitialBranch(tenantId);

      // Mark the mutli-branches is activated.
      await this.branchesSettings.markMultiBranchesAsActivated(tenantId);

      // Triggers `onBranchActivated` branch.
      await this.eventPublisher.emitAsync(events.branch.onActivated, {
        tenantId,
        primaryBranch,
        trx,
      } as IBranchesActivatedPayload);
    });
  };
}
