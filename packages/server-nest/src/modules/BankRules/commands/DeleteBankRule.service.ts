import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  IBankRuleEventDeletedPayload,
  IBankRuleEventDeletingPayload,
} from '../types';
import { BankRule } from '../models/BankRule';
import { BankRuleCondition } from '../models/BankRuleCondition';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteBankRuleService {
  constructor(
    @Inject(BankRule.name)
    private bankRuleModel: TenantModelProxy<typeof BankRule>,

    @Inject(BankRuleCondition.name)
    private bankRuleConditionModel: TenantModelProxy<typeof BankRuleCondition>,

    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
  ) {}

  /**
   * Deletes the given bank rule.
   * @param {number} ruleId
   * @returns {Promise<void>}
   */
  public async deleteBankRule(
    ruleId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const oldBankRule = await this.bankRuleModel()
      .query()
      .findById(ruleId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBankRuleDeleting` event.
      await this.eventPublisher.emitAsync(events.bankRules.onDeleting, {
        oldBankRule,
        ruleId,
        trx,
      } as IBankRuleEventDeletingPayload);

      await this.bankRuleConditionModel()
        .query(trx)
        .where('ruleId', ruleId)
        .delete();

      await this.bankRuleModel().query(trx).findById(ruleId).delete();

      // Triggers `onBankRuleDeleted` event.
      await this.eventPublisher.emitAsync(events.bankRules.onDeleted, {
        ruleId,
        trx,
      } as IBankRuleEventDeletedPayload);
    }, trx);
  }
}
