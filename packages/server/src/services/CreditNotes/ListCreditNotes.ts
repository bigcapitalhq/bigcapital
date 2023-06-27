import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { ICreditNotesQueryDTO } from '@/interfaces';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import BaseCreditNotes from './CreditNotes';
import { CreditNoteTransformer } from './CreditNoteTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class ListCreditNotes extends BaseCreditNotes {
  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses the sale invoice list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO = (filterDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieves the paginated and filterable credit notes list.
   * @param {number} tenantId -
   * @param {ICreditNotesQueryDTO} creditNotesQuery -
   */
  public getCreditNotesList = async (
    tenantId: number,
    creditNotesQuery: ICreditNotesQueryDTO
  ) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(creditNotesQuery);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      CreditNote,
      filter
    );
    const { results, pagination } = await CreditNote.query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('customer');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transforms the credit notes to POJO.
    const creditNotes = await this.transformer.transform(
      tenantId,
      results,
      new CreditNoteTransformer()
    );

    return {
      creditNotes,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  };
}
