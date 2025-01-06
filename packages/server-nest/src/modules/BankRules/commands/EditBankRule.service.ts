import { Inject, Injectable } from '@nestjs/common';
import {
  IBankRuleEventEditedPayload,
  IBankRuleEventEditingPayload,
  IEditBankRuleDTO,
} from '../types';
import { BankRule } from '../models/BankRule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class EditBankRuleService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(BankRule.name) private bankRuleModel: typeof BankRule,
  ) {}

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
   * @param {number} ruleId -
   * @param {IEditBankRuleDTO} editBankDTO
   */
  public async editBankRule(
    ruleId: number,
    editRuleDTO: IEditBankRuleDTO
  ) {
    const oldBankRule = await this.bankRuleModel.query()
      .findById(ruleId)
      .withGraphFetched('conditions')
      .throwIfNotFound();

    const tranformDTO = this.transformDTO(editRuleDTO);

    return this.uow.withTransaction(async (trx) => {
      // Triggers `onBankRuleEditing` event.
      await this.eventPublisher.emitAsync(events.bankRules.onEditing, {
        oldBankRule,
        ruleId,
        editRuleDTO,
        trx,
      } as IBankRuleEventEditingPayload);

      // Updates the given bank rule.
      const bankRule = await this.bankRuleModel.query(trx).upsertGraphAndFetch({
        ...tranformDTO,
        id: ruleId,
      });
      // Triggers `onBankRuleEdited` event.
      await this.eventPublisher.emitAsync(events.bankRules.onEdited, {
        oldBankRule,
        bankRule,
        editRuleDTO,
        trx,
      } as IBankRuleEventEditedPayload);
    });
  }
}
