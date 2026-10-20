import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ServiceError } from '../Items/ServiceError';
import { ERRORS } from './AccountsTemplates.constants';
import {
  planAccountsTemplate,
  resolveAccountsTemplate,
} from './AccountsTemplatePlanner';
import {
  AccountsTemplateState,
  AccountsTemplateStateService,
} from './AccountsTemplateState.service';
import {
  AccountsTemplate,
  AccountsTemplatePlan,
  ResolvedAccountsTemplate,
} from './AccountsTemplates.types';
import { ACCOUNTS_TEMPLATES } from './templates';

export interface PreparedAccountsTemplatePlan {
  template: ResolvedAccountsTemplate;
  state: AccountsTemplateState;
  plan: AccountsTemplatePlan;
}

@Injectable()
export class PreviewAccountsTemplateService {
  constructor(private readonly stateService: AccountsTemplateStateService) {}

  /**
   * Retrieves the registered templates.
   */
  public getTemplates(): AccountsTemplate[] {
    return ACCOUNTS_TEMPLATES;
  }

  /**
   * Resolves the template and variant or throws a not found service error.
   * @param {string} templateKey
   * @param {string} variantKey
   */
  public resolveOrThrow(
    templateKey: string,
    variantKey?: string | null,
  ): ResolvedAccountsTemplate {
    const template = ACCOUNTS_TEMPLATES.find((t) => t.key === templateKey);

    if (!template) {
      throw new ServiceError(
        ERRORS.TEMPLATE_NOT_FOUND,
        `There is no chart of accounts template "${templateKey}".`,
        null,
        404,
      );
    }
    const resolved = resolveAccountsTemplate(template, variantKey);

    if (!resolved) {
      throw new ServiceError(
        ERRORS.TEMPLATE_VARIANT_NOT_FOUND,
        `The template "${templateKey}" has no variant "${variantKey}".`,
      );
    }
    return resolved;
  }

  /**
   * Plans the template against the current chart of accounts.
   * @param {string} templateKey
   * @param {string} variantKey
   * @param {Knex.Transaction} trx
   */
  public async prepare(
    templateKey: string,
    variantKey?: string | null,
    trx?: Knex.Transaction,
  ): Promise<PreparedAccountsTemplatePlan> {
    const template = this.resolveOrThrow(templateKey, variantKey);
    const state = await this.stateService.load(template, trx);
    const plan = planAccountsTemplate(template, state.existing, state.context);

    return { template, state, plan };
  }

  /**
   * Previews the changes applying the template would make. Writes nothing.
   * @param {string} templateKey
   * @param {string} variantKey
   */
  public async preview(
    templateKey: string,
    variantKey?: string | null,
  ): Promise<AccountsTemplatePlan> {
    const { plan } = await this.prepare(templateKey, variantKey);

    return plan;
  }
}
