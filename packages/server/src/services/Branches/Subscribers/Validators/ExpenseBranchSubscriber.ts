import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IExpenseCreatingPayload,
  IExpenseEventEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class ExpenseBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.expenses.onCreating,
      this.validateBranchExistanceOnExpenseCreating
    );
    bus.subscribe(
      events.expenses.onEditing,
      this.validateBranchExistanceOnExpenseEditing
    );
    return bus;
  };

  /**
   * Validate branch existance once expense transaction creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistanceOnExpenseCreating = async ({
    tenantId,
    expenseDTO,
  }: IExpenseCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      expenseDTO.branchId
    );
  };

  /**
   * Validate branch existance once expense transaction editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnExpenseEditing = async ({
    expenseDTO,
    tenantId,
  }: IExpenseEventEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      expenseDTO.branchId
    );
  };
}
