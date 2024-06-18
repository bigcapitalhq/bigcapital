import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import {
  IBankRuleEventEditedPayload,
  IBankRuleEventEditingPayload,
  IEditBankRuleDTO,
} from './types';

@Service()
export class EditBankRuleService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   *
   * @param createDTO
   * @returns
   */
  private transformDTO(createDTO: IEditBankRuleDTO) {
    return {
      ...createDTO,
    };
  }

  /**
   * Edits the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId -
   * @param {IEditBankRuleDTO} editBankDTO
   */
  public async editBankRule(
    tenantId: number,
    ruleId: number,
    editRuleDTO: IEditBankRuleDTO
  ) {
    const { BankRule } = this.tenancy.models(tenantId);

    const oldBankRule = await BankRule.query()
      .findById(ruleId)
      .throwIfNotFound();

    const tranformDTO = this.transformDTO(editRuleDTO);

    return this.uow.withTransaction(
      tenantId,
      async (trx?: Knex.Transaction) => {
        // Triggers `onBankRuleEditing` event.
        await this.eventPublisher.emitAsync(events.bankRules.onEditing, {
          oldBankRule,
          ruleId,
          editRuleDTO,
          trx,
        } as IBankRuleEventEditingPayload);

        // Updates the given bank rule.
        await BankRule.query()
          .findById(ruleId)
          .patch({ ...tranformDTO });

        // Triggers `onBankRuleEdited` event.
        await this.eventPublisher.emitAsync(events.bankRules.onEdited, {
          oldBankRule,
          ruleId,
          editRuleDTO,
          trx,
        } as IBankRuleEventEditedPayload);
      }
    );
  }
}
