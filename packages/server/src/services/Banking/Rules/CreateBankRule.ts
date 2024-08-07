import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventCreatingPayload,
  ICreateBankRuleDTO,
} from './types';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';

@Service()
export class CreateBankRuleService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Transformes the DTO to model.
   * @param {ICreateBankRuleDTO} createDTO
   * @returns
   */
  private transformDTO(createDTO: ICreateBankRuleDTO) {
    return {
      ...createDTO,
    };
  }

  /**
   * Creates a new bank rule.
   * @param {number} tenantId
   * @param {ICreateBankRuleDTO} createRuleDTO
   * @returns {Promise<void>}
   */
  public createBankRule(
    tenantId: number,
    createRuleDTO: ICreateBankRuleDTO
  ): Promise<void> {
    const { BankRule } = this.tenancy.models(tenantId);

    const transformDTO = this.transformDTO(createRuleDTO);

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBankRuleCreating` event.
      await this.eventPublisher.emitAsync(events.bankRules.onCreating, {
        tenantId,
        createRuleDTO,
        trx,
      } as IBankRuleEventCreatingPayload);

      const bankRule = await BankRule.query(trx).upsertGraph({
        ...transformDTO,
      });

      // Triggers `onBankRuleCreated` event.
      await this.eventPublisher.emitAsync(events.bankRules.onCreated, {
        tenantId,
        createRuleDTO,
        bankRule,
        trx,
      } as IBankRuleEventCreatedPayload);

      return bankRule;
    });
  }
}
