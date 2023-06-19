import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IExpenseCreatingPayload,
  IExpenseEventEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class ExpenseBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.expenses.onCreating,
      this.validateBranchExistenceOnExpenseCreating
    );
    bus.subscribe(
      events.expenses.onEditing,
      this.validateBranchExistenceOnExpenseEditing
    );
    return bus;
  };

  /**
   * Validate branch existence once expense transaction creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistenceOnExpenseCreating = async ({
    tenantId,
    expenseDTO,
  }: IExpenseCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      expenseDTO.branchId
    );
  };

  /**
   * Validate branch existence once expense transaction editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnExpenseEditing = async ({
    expenseDTO,
    tenantId,
  }: IExpenseEventEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      expenseDTO.branchId
    );
  };
}
