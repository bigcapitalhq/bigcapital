import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { kebabCase } from 'lodash';
import { PartialModelObject } from 'objection';
import { events } from '@/common/events/events';
import { Account } from '../Accounts/models/Account.model';
import {
  IAccountEventCreatedPayload,
  IAccountEventDeletedPayload,
} from '../Accounts/Accounts.types';
import { ServiceError } from '../Items/ServiceError';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { ERRORS, PROTECTED_SLUGS } from './AccountsTemplates.constants';
import {
  AccountRow,
  AccountsTemplateChangeAction,
  AccountsTemplatePlan,
} from './AccountsTemplates.types';
import { PreviewAccountsTemplateService } from './PreviewAccountsTemplate.service';

// The account model declares no description, so the input is typed by hand.
type AccountInput = PartialModelObject<Account> &
  Pick<AccountRow, 'description'>;

@Injectable()
export class ApplyAccountsTemplateService {
  constructor(
    private readonly previewService: PreviewAccountsTemplateService,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Applies the template to the chart of accounts in one transaction. The
   * plan is recomputed inside the transaction rather than taken from the
   * client, so what is applied always matches the current chart.
   * @param {string} templateKey
   * @param {string} variantKey
   */
  public async apply(
    templateKey: string,
    variantKey?: string | null,
  ): Promise<AccountsTemplatePlan> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const { template, state, plan } = await this.previewService.prepare(
        templateKey,
        variantKey,
        trx,
      );
      if (plan.errors.length > 0) {
        throw new ServiceError(
          ERRORS.TEMPLATE_CANNOT_BE_APPLIED,
          'The template conflicts with the current chart of accounts.',
          { errors: plan.errors },
        );
      }
      const accountsById = new Map(
        state.accounts.map((account) => [account.id, account]),
      );
      const idByTemplateCode = new Map<string, number>();
      const byAction = (action: AccountsTemplateChangeAction) =>
        plan.changes.filter((change) => change.action === action);

      // Removals go through the same events as deleting an account by hand.
      for (const change of byAction(AccountsTemplateChangeAction.Remove)) {
        const oldAccount = accountsById.get(change.accountId);

        await this.eventEmitter.emitAsync(events.accounts.onDelete, {
          trx,
          oldAccount,
        } as IAccountEventDeletedPayload);

        await this.accountModel().query(trx).deleteById(change.accountId);

        await this.eventEmitter.emitAsync(events.accounts.onDeleted, {
          accountId: change.accountId,
          oldAccount,
          trx,
        } as IAccountEventDeletedPayload);
      }

      for (const change of byAction(AccountsTemplateChangeAction.Update)) {
        const patch: AccountInput = {
          code: change.after.code,
          name: change.after.name,
          description: change.after.description,
        };
        await this.accountModel()
          .query(trx)
          .findById(change.accountId)
          .patch(patch as PartialModelObject<Account>);
      }
      plan.changes
        .filter((change) => change.accountId && change.templateCode)
        .forEach((change) =>
          idByTemplateCode.set(change.templateCode, change.accountId),
        );

      // A new account's slug is derived from its name, as when it is created
      // by hand, but must not take a slug the application looks accounts up
      // by, or those lookups could land on it.
      const reservedSlugs = new Set<string>([
        ...PROTECTED_SLUGS,
        ...template.remove,
        ...template.accounts.map((entry) => entry.slug).filter(Boolean),
        ...state.existing
          .filter((account) => account.predefined || account.seeded)
          .map((account) => account.slug)
          .filter(Boolean),
      ]);

      for (const change of byAction(AccountsTemplateChangeAction.Create)) {
        const slug = kebabCase(change.after.name);
        const input: AccountInput = {
          name: change.after.name,
          code: change.after.code,
          accountType: change.accountType,
          description: change.after.description,
          slug: reservedSlugs.has(slug) ? `${slug}-${change.after.code}` : slug,
          currencyCode: state.context.baseCurrency,
          active: true,
          predefined: false,
        };
        const account: Account = await this.accountModel()
          .query(trx)
          .insertAndFetch(input as PartialModelObject<Account>);
        change.accountId = account.id;
        idByTemplateCode.set(change.templateCode, account.id);

        await this.eventEmitter.emitAsync(events.accounts.onCreated, {
          account,
          accountId: account.id,
          trx,
        } as IAccountEventCreatedPayload);
      }

      // Parents last, once every account they point at exists.
      for (const change of plan.changes) {
        if (!change.parentTemplateCode) continue;

        const parentAccountId = idByTemplateCode.get(change.parentTemplateCode);

        if (parentAccountId) {
          await this.accountModel()
            .query(trx)
            .findById(change.accountId)
            .patch({ parentAccountId });
        }
      }
      return plan;
    });
  }
}
