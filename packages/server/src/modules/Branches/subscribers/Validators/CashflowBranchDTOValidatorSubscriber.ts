import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { ICommandCashflowCreatingPayload } from '@/modules/BankingTransactions/types/BankingTransactions.types';

@Injectable()
export class CashflowBranchDTOValidatorSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance once cashflow transaction creating.
   * @param {ICommandCashflowCreatingPayload} payload
   */
  @OnEvent(events.cashflow.onTransactionCreating)
  async validateBranchExistanceOnCashflowTransactionCreating({
    newTransactionDTO,
  }: ICommandCashflowCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      newTransactionDTO.branchId,
    );
  }
}
