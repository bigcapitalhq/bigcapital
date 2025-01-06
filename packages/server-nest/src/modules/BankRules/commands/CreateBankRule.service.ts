import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventCreatingPayload,
  ICreateBankRuleDTO,
} from '../types';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { BankRule } from '../models/BankRule';

@Injectable()
export class CreateBankRuleService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(BankRule.name) private readonly bankRuleModel: typeof BankRule,
  ) {}

  /**
   * Transforms the DTO to model.
   * @param {ICreateBankRuleDTO} createDTO
   */
  private transformDTO(createDTO: ICreateBankRuleDTO) {
    return {
      ...createDTO,
    };
  }

  /**
   * Creates a new bank rule.
   * @param {ICreateBankRuleDTO} createRuleDTO
   * @returns {Promise<BankRule>}
   */
  public async createBankRule(
    createRuleDTO: ICreateBankRuleDTO,
  ): Promise<BankRule> {
    const transformDTO = this.transformDTO(createRuleDTO);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBankRuleCreating` event.
      await this.eventPublisher.emitAsync(events.bankRules.onCreating, {
        createRuleDTO,
        trx,
      } as IBankRuleEventCreatingPayload);

      const bankRule = await this.bankRuleModel.query(trx).upsertGraphAndFetch({
        ...transformDTO,
      });
      // Triggers `onBankRuleCreated` event.
      await this.eventPublisher.emitAsync(events.bankRules.onCreated, {
        createRuleDTO,
        bankRule,
        trx,
      } as IBankRuleEventCreatedPayload);

      return bankRule;
    });
  }
}
