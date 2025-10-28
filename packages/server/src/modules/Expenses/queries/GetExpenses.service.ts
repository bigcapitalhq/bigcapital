import * as R from 'ramda';
import { ExpenseTransfromer } from './Expense.transformer';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { IExpensesFilter, IPaginationMeta } from '../Expenses.types';
import { Expense } from '../models/Expense.model';
import { IFilterMeta } from '@/interfaces/Model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetExpensesService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly dynamicListService: DynamicListService,

    @Inject(Expense.name)
    private readonly expense: TenantModelProxy<typeof Expense>,
  ) {}

  /**
   * Retrieve expenses paginated list.
   * @param  {IExpensesFilter} expensesFilter
   * @return {IExpense[]}
   */
  public async getExpensesList(filterDto: Partial<IExpensesFilter>): Promise<{
    expenses: Expense[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const _filterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDto,
    };
    // Parses list filter DTO.
    const filter = this.parseListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.expense(),
      filter,
    );
    // Retrieves the paginated results.
    const { results, pagination } = await this.expense()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('paymentAccount');
        builder.withGraphFetched('categories.expenseAccount');

        dynamicList.buildQuery()(builder);
        _filterDto?.filterQuery && _filterDto?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the expenses models to POJO.
    const expenses = await this.transformer.transform(
      results,
      new ExpenseTransfromer(),
    );
    return {
      expenses,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Parses filter DTO of expenses list.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
