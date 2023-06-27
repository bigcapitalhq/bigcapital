import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import {
  IManualJournalsFilter,
  IManualJournal,
  IPaginationMeta,
  IFilterMeta,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ManualJournalTransformer } from './ManualJournalTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetManualJournals {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses filter DTO of the manual journals list.
   * @param filterDTO
   */
  private parseListFilterDTO = (filterDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieve manual journals datatable list.
   * @param {number} tenantId -
   * @param {IManualJournalsFilter} filter -
   */
  public getManualJournals = async (
    tenantId: number,
    filterDTO: IManualJournalsFilter
  ): Promise<{
    manualJournals: IManualJournal;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> => {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic service.
    const dynamicService = await this.dynamicListService.dynamicList(
      tenantId,
      ManualJournal,
      filter
    );
    const { results, pagination } = await ManualJournal.query()
      .onBuild((builder) => {
        dynamicService.buildQuery()(builder);
        builder.withGraphFetched('entries.account');
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transforms the manual journals models to POJO.
    const manualJournals = await this.transformer.transform(
      tenantId,
      results,
      new ManualJournalTransformer()
    );

    return {
      manualJournals,
      pagination,
      filterMeta: dynamicService.getResponseMeta(),
    };
  };
}
