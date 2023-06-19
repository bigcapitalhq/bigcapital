import { Service, Inject } from 'typedi';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import {
  IExpense,
  IExpenseCreateDTO,
  IExpenseDTO,
  IExpenseEditDTO,
  ISystemUser,
} from '@/interfaces';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TenantMetadata } from '@/system/models';

@Service()
export class ExpenseDTOTransformer {
  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Retrieve the expense landed cost amount.
   * @param  {IExpenseDTO} expenseDTO
   * @return {number}
   */
  private getExpenseLandedCostAmount = (expenseDTO: IExpenseDTO): number => {
    const landedCostEntries = expenseDTO.categories.filter((entry) => {
      return entry.landedCost === true;
    });
    return this.getExpenseCategoriesTotal(landedCostEntries);
  };

  /**
   * Retrieve the given expense categories total.
   * @param   {IExpenseCategory} categories
   * @returns {number}
   */
  private getExpenseCategoriesTotal = (categories): number => {
    return sumBy(categories, 'amount');
  };

  /**
   * Mapping expense DTO to model.
   * @param  {IExpenseDTO} expenseDTO
   * @param  {ISystemUser} authorizedUser
   * @return {IExpense}
   */
  private expenseDTOToModel(
    tenantId: number,
    expenseDTO: IExpenseCreateDTO | IExpenseEditDTO,
    user?: ISystemUser
  ): IExpense {
    const landedCostAmount = this.getExpenseLandedCostAmount(expenseDTO);
    const totalAmount = this.getExpenseCategoriesTotal(expenseDTO.categories);

    const initialDTO = {
      categories: [],
      ...omit(expenseDTO, ['publish']),
      totalAmount,
      landedCostAmount,
      paymentDate: moment(expenseDTO.paymentDate).toMySqlDateTime(),
      ...(expenseDTO.publish
        ? {
            publishedAt: moment().toMySqlDateTime(),
          }
        : {}),
    };
    return R.compose(this.branchDTOTransform.transformDTO<IExpense>(tenantId))(
      initialDTO
    );
  }

  /**
   * Transforms the expense create DTO.
   * @param   {number} tenantId
   * @param   {IExpenseCreateDTO} expenseDTO
   * @param   {ISystemUser} user
   * @returns {IExpense}
   */
  public expenseCreateDTO = async (
    tenantId: number,
    expenseDTO: IExpenseCreateDTO,
    user?: ISystemUser
  ): Promise<IExpense> => {
    const initialDTO = this.expenseDTOToModel(tenantId, expenseDTO, user);

    // Retrieves the tenant metadata.
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    return {
      ...initialDTO,
      currencyCode: expenseDTO.currencyCode || tenantMetadata?.baseCurrency,
      exchangeRate: expenseDTO.exchangeRate || 1,
      ...(user
        ? {
            userId: user.id,
          }
        : {}),
    };
  };

  /**
   * Transforms the expense edit DTO.
   * @param   {number} tenantId
   * @param   {IExpenseEditDTO} expenseDTO
   * @param   {ISystemUser} user
   * @returns {IExpense}
   */
  public expenseEditDTO = async (
    tenantId: number,
    expenseDTO: IExpenseEditDTO,
    user?: ISystemUser
  ): Promise<IExpense> => {
    return this.expenseDTOToModel(tenantId, expenseDTO, user);
  };
}
