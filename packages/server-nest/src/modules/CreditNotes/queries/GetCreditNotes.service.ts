import * as R from 'ramda';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { ICreditNotesQueryDTO } from '../types/CreditNotes.types';
import { CreditNote } from '../models/CreditNote';
import { CreditNoteTransformer } from './CreditNoteTransformer';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCreditNotesService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

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
  public async getCreditNotesList(
    creditNotesQuery: ICreditNotesQueryDTO,
  ): Promise<GetCreditNotesResponse> {
    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(creditNotesQuery);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      CreditNote,
      filter,
    );
    const { results, pagination } = await this.creditNoteModel
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries.item');
        builder.withGraphFetched('customer');
        dynamicFilter.buildQuery()(builder);
        creditNotesQuery?.filterQuery && creditNotesQuery?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transforomes the credit notes to POJO.
    const creditNotes = await this.transformer.transform(
      results,
      new CreditNoteTransformer(),
    );

    return {
      creditNotes,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
