import { Injectable } from '@nestjs/common';
import { omit, sumBy } from 'lodash';
import * as moment from 'moment';
import * as R from 'ramda';
import * as composeAsync from 'async/compose';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { Expense } from '../models/Expense.model';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  CreateExpenseDto,
  EditExpenseDto,
  ExpensePaymentSplitDto,
} from '../dtos/Expense.dto';

@Injectable()
export class ExpenseDTOTransformer {
  /**
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - Branch transaction DTO transformer.
   * @param {TenancyContext} tenancyContext - Tenancy context.
   */
  constructor(
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve the expense landed cost amount.
   * @param  {IExpenseDTO} expenseDTO
   * @return {number}
   */
  private getExpenseLandedCostAmount = (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
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
   * Normalize category rows: compute `amount` for percent-typed rows so the
   * DB `amount` column stays the GL source of truth. Percent/amountType are
   * persisted alongside so edit-mode preserves the author's intent.
   */
  private normalizeCategoryAmounts = (
    categories: any[] = [],
    total: number,
  ): any[] => {
    return categories.map((cat) => {
      const amountType = cat.amountType === 'percent' ? 'percent' : 'fixed';
      const percent =
        amountType === 'percent' && cat.percent != null
          ? Number(cat.percent)
          : null;
      const amount =
        amountType === 'percent' && percent != null
          ? Math.round(((total * percent) / 100) * 1000) / 1000
          : cat.amount;
      return {
        ...cat,
        amountType,
        percent,
        amount,
      };
    });
  };

  /**
   * Normalize payment splits. If the DTO provides a splits array, use it.
   * Otherwise synthesize a single split from the legacy `paymentAccountId`
   * and the computed total so the new table is always populated.
   */
  private normalizePaymentSplits = (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
    total: number,
  ): ExpensePaymentSplitDto[] => {
    const provided = (expenseDTO.paymentSplits || []).filter(
      (s) => s && s.paymentAccountId != null,
    );
    if (provided.length > 0) {
      return provided.map((s, i) => ({
        // Preserve the split id on edit so upsertGraph updates in place;
        // losing it deletes + reinserts the row and orphans any
        // matched_bank_transactions.reference_sub_id pointing at it.
        ...(s.id != null ? { id: s.id } : {}),
        index: s.index ?? i + 1,
        paymentAccountId: s.paymentAccountId,
        amount: s.amount,
      }));
    }
    if (expenseDTO.paymentAccountId != null) {
      return [
        {
          index: 1,
          paymentAccountId: expenseDTO.paymentAccountId,
          amount: total,
        },
      ];
    }
    return [];
  };

  /**
   * Mapping expense DTO to model.
   * @param {IExpenseDTO} expenseDTO
   * @param {ISystemUser} authorizedUser
   * @return {IExpense}
   */
  private async expenseDTOToModel(
    expenseDTO: CreateExpenseDto | EditExpenseDto,
  ): Promise<Expense> {
    // Resolve payment splits first; their sum is the authoritative total the
    // expense must balance to. Percent-typed category rows compute their
    // amount against this figure rather than against a category self-sum
    // (which would be circular for all-percent categories).
    const preliminaryTotal = this.getExpenseCategoriesTotal(
      expenseDTO.categories,
    );
    const paymentSplits = this.normalizePaymentSplits(
      expenseDTO,
      preliminaryTotal,
    );
    const splitsTotal = sumBy(paymentSplits, 'amount') || 0;

    const normalizedCategories = this.normalizeCategoryAmounts(
      expenseDTO.categories || [],
      splitsTotal,
    );
    const categories = R.compose(
      // Associate the default index to categories lines.
      assocItemEntriesDefaultIndex,
    )(normalizedCategories);

    const totalAmount = this.getExpenseCategoriesTotal(normalizedCategories);
    const landedCostAmount = this.getExpenseLandedCostAmount({
      ...expenseDTO,
      categories: normalizedCategories,
    } as any);

    // Keep the denormalized header account in sync with the first split.
    const primaryPaymentAccountId =
      paymentSplits[0]?.paymentAccountId ?? expenseDTO.paymentAccountId;

    const initialDTO = {
      ...omit(expenseDTO, ['publish', 'attachments', 'paymentSplits']),
      categories,
      paymentSplits,
      paymentAccountId: primaryPaymentAccountId,
      totalAmount,
      landedCostAmount,
      paymentDate: moment(expenseDTO.paymentDate).toMySqlDateTime(),
      ...(expenseDTO.publish
        ? {
            publishedAt: moment().toMySqlDateTime(),
          }
        : {}),
    };
    const asyncDto = await composeAsync(
      this.branchDTOTransform.transformDTO<Expense>,
    )(initialDTO);

    return asyncDto as Expense;
  }

  /**
   * Transforms the expense create DTO.
   * @param {IExpenseCreateDTO} expenseDTO
   * @returns {Promise<Expense>}
   */
  public expenseCreateDTO = async (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
  ): Promise<Partial<Expense>> => {
    const initialDTO = await this.expenseDTOToModel(expenseDTO);
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
   * @param {EditExpenseDto} expenseDTO
   * @returns {Promise<Expense>}
   */
  public expenseEditDTO = async (
    expenseDTO: EditExpenseDto,
  ): Promise<Expense> => {
    return this.expenseDTOToModel(expenseDTO);
  };
}
