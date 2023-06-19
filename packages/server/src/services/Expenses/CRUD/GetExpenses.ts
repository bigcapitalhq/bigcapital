import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import {
  IExpensesFilter,
  IExpense,
  IPaginationMeta,
  IFilterMeta,
} from '@/interfaces';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ExpenseTransformer } from './ExpenseTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetExpenses {
  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve expenses paginated list.
   * @param  {number} tenantId
   * @param  {IExpensesFilter} expensesFilter
   * @return {IExpense[]}
   */
  public getExpensesList = async (
    tenantId: number,
    filterDTO: IExpensesFilter
  ): Promise<{
    expenses: IExpense[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> => {
    const { Expense } = this.tenancy.models(tenantId);

    // Parses list filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Expense,
      filter
    );
    // Retrieves the paginated results.
    const { results, pagination } = await Expense.query()
      .onBuild((builder) => {
        builder.withGraphFetched('paymentAccount');
        builder.withGraphFetched('categories.expenseAccount');

        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transforms the expenses models to POJO.
    const expenses = await this.transformer.transform(
      tenantId,
      results,
      new ExpenseTransformer()
    );
    return {
      expenses,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  };

  /**
   * Parses filter DTO of expenses list.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
