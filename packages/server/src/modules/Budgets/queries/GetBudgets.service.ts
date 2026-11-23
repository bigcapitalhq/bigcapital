import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget';
import { GetBudgetsQueryDto } from '../dtos/GetBudgetsQuery.dto';
import { BudgetTransformer } from './BudgetTransformer';

@Injectable()
export class GetBudgets {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  /**
   * Parses the filter DTO of the budgets list.
   * @param {GetBudgetsQueryDto} filterDTO
   * @returns
   */
  private parseListFilterDTO = (filterDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieves the budgets paginated list.
   * @param {GetBudgetsQueryDto} filterDTO
   * @returns {Promise<{ data; pagination; filterMeta }>}
   */
  public getBudgets = async (
    filterDTO: GetBudgetsQueryDto,
  ): Promise<{
    data: Budget[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> => {
    const _filterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDTO,
    };
    // Parses filter DTO.
    const filter = this.parseListFilterDTO(_filterDto);

    // Dynamic service.
    const dynamicService = await this.dynamicListService.dynamicList(
      this.budgetModel(),
      filter,
    );
    const { results, pagination } = await this.budgetModel()
      .query()
      .onBuild((builder) => {
        dynamicService.buildQuery()(builder);
        builder.withGraphFetched('entries');
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the budgets models to POJO.
    const data = await this.transformer.transform(
      results,
      new BudgetTransformer(),
    );

    return {
      data,
      pagination,
      filterMeta: dynamicService.getResponseMeta(),
    };
  };
}
