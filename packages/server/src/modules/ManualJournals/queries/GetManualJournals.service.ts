import * as R from 'ramda';
import { ManualJournalTransfromer } from './ManualJournalTransformer';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { ManualJournal } from '../models/ManualJournal';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { IManualJournalsFilter } from '../types/ManualJournals.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetManualJournals {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(ManualJournal.name)
    private readonly manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {}

  /**
   * Parses filter DTO of the manual journals list.
   * @param filterDTO
   */
  private parseListFilterDTO = (filterDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieve manual journals datatable list.
   * @param {IManualJournalsFilter} filter -
   */
  public getManualJournals = async (
    filterDTO: IManualJournalsFilter,
  ): Promise<{
    manualJournals: ManualJournal[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> => {
    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic service.
    const dynamicService = await this.dynamicListService.dynamicList(
      this.manualJournalModel(),
      filter,
    );
    const { results, pagination } = await this.manualJournalModel()
      .query()
      .onBuild((builder) => {
        dynamicService.buildQuery()(builder);
        builder.withGraphFetched('entries.account');
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the manual journals models to POJO.
    const manualJournals = await this.transformer.transform(
      results,
      new ManualJournalTransfromer(),
    );

    return {
      manualJournals,
      pagination,
      filterMeta: dynamicService.getResponseMeta(),
    };
  };
}
