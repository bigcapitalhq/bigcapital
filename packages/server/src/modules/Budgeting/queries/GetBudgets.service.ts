import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { Budget } from '../models/Budget.model';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { GetBudgetsQueryDto } from '../dtos/GetBudgetsQuery.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BudgetTransformer } from './BudgetTransformer';

@Injectable()
export class GetBudgetsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  private parseListFilterDTO = (filterDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  public getBudgets = async (
    filterDTO: GetBudgetsQueryDto,
  ): Promise<{
    budgets: Budget[];
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

    const filter = this.parseListFilterDTO(_filterDto);

    const dynamicService = await this.dynamicListService.dynamicList(
      this.budgetModel(),
      filter,
    );

    const { results, pagination } = await this.budgetModel()
      .query()
      .onBuild((builder) => {
        dynamicService.buildQuery()(builder);
        builder.withGraphFetched('entries.account');
      })
      .pagination(filter.page - 1, filter.pageSize);

    const budgets = await this.transformer.transform(
      results,
      new BudgetTransformer(),
    );

    return {
      budgets,
      pagination,
      filterMeta: dynamicService.getResponseMeta(),
    };
  };
}
