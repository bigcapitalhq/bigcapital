import { omit, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import {
  IExpenseCreateDTO,
  IExpenseCommonDTO,
  IExpenseEditDTO,
} from '../interfaces/Expenses.interface';
// import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
// import { TenantMetadata } from '@/system/models';
import { Injectable } from '@nestjs/common';
import { Expense } from '../models/Expense.model';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class ExpenseDTOTransformer {
  constructor(
    // private readonly branchDTOTransform: BranchTransactionDTOTransform;
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve the expense landed cost amount.
   * @param  {IExpenseDTO} expenseDTO
   * @return {number}
   */
  private getExpenseLandedCostAmount = (
    expenseDTO: IExpenseCreateDTO | IExpenseEditDTO,
  ): number => {
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
   * @param {IExpenseDTO} expenseDTO
   * @param {ISystemUser} authorizedUser
   * @return {IExpense}
   */
  private expenseDTOToModel(
    expenseDTO: IExpenseCreateDTO | IExpenseEditDTO,
    // user?: ISystemUser
  ): Expense {
    const landedCostAmount = this.getExpenseLandedCostAmount(expenseDTO);
    const totalAmount = this.getExpenseCategoriesTotal(expenseDTO.categories);

    const categories = R.compose(
      // Associate the default index to categories lines.
      assocItemEntriesDefaultIndex,
    )(expenseDTO.categories || []);

    const initialDTO = {
      ...omit(expenseDTO, ['publish', 'attachments']),
      categories,
      totalAmount,
      landedCostAmount,
      paymentDate: moment(expenseDTO.paymentDate).toMySqlDateTime(),
      ...(expenseDTO.publish
        ? {
            publishedAt: moment().toMySqlDateTime(),
          }
        : {}),
    };
    return initialDTO;
    // return R.compose(this.branchDTOTransform.transformDTO<IExpense>(tenantId))(
    // initialDTO
    // );
  }

  /**
   * Transformes the expense create DTO.
   * @param {IExpenseCreateDTO} expenseDTO
   * @returns {Promise<Expense>}
   */
  public expenseCreateDTO = async (
    expenseDTO: IExpenseCreateDTO,
  ): Promise<Expense> => {
    const initialDTO = this.expenseDTOToModel(expenseDTO);
    const tenant = await this.tenancyContext.getTenant(true);

    return {
      ...initialDTO,
      currencyCode: expenseDTO.currencyCode || tenant?.metadata?.baseCurrency,
      exchangeRate: expenseDTO.exchangeRate || 1,
      // ...(user
      //   ? {
      //       userId: user.id,
      //     }
      //   : {}),
    };
  };

  /**
   * Transformes the expense edit DTO.
   * @param {number} tenantId
   * @param {IExpenseEditDTO} expenseDTO
   * @param {ISystemUser} user
   * @returns {IExpense}
   */
  public expenseEditDTO = async (
    expenseDTO: IExpenseEditDTO,
  ): Promise<Expense> => {
    return this.expenseDTOToModel(expenseDTO);
  };
}
