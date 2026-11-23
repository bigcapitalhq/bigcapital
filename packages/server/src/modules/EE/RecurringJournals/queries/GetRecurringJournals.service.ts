import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { RecurringJournal } from '../models/RecurringJournal';
import { GetRecurringJournalsQueryDto } from '../dtos/GetRecurringJournalsQuery.dto';
import { RecurringJournalTransformer } from './RecurringJournal.transformer';

@Injectable()
export class GetRecurringJournals {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Retrieves the paginated and filterable recurring journals list.
   */
  public async getRecurringJournals(
    filterDTO: GetRecurringJournalsQueryDto,
  ): Promise<{
    data: RecurringJournal[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const _filterDto = {
      sortOrder: 'ASC',
      columnSortBy: 'next_journal_date',
      page: 1,
      pageSize: 12,
      ...filterDTO,
    };
    const filter = this.parseListFilterDTO(_filterDto);

    const dynamicFilter = await this.dynamicListService.dynamicList(
      this.recurringJournalModel(),
      filter,
    );

    const { results, pagination } = await this.recurringJournalModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');

        dynamicFilter.buildQuery()(builder);
        _filterDto?.filterQuery?.(builder as any);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const data = await this.transformer.transform(
      results,
      new RecurringJournalTransformer(),
    );

    return {
      data,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Parses the stringified filter roles.
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
