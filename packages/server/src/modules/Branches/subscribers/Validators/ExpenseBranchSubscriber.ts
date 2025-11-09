import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import {
  IExpenseCreatingPayload,
  IExpenseEventEditingPayload,
} from '@/modules/Expenses/Expenses.types';
@Injectable()
export class ExpenseBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance once expense transaction creating.
   * @param {IExpenseCreatingPayload} payload
   */
  @OnEvent(events.expenses.onCreating)
  async validateBranchExistanceOnExpenseCreating({
    expenseDTO,
  }: IExpenseCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      expenseDTO.branchId,
    );
  }

  /**
   * Validate branch existance once expense transaction editing.
   * @param {IExpenseEventEditingPayload} payload
   */
  @OnEvent(events.expenses.onEditing)
  async validateBranchExistanceOnExpenseEditing({
    expenseDTO,
  }: IExpenseEventEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      expenseDTO.branchId,
    );
  }
}
