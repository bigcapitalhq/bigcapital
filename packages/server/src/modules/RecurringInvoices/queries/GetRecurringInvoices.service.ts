import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { GetRecurringInvoicesQueryDto } from '../dtos/GetRecurringInvoicesQuery.dto';
import { RecurringInvoiceTransformer } from './RecurringInvoice.transformer';

@Injectable()
export class GetRecurringInvoices {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,
  ) {}

  /**
   * Retrieves the paginated and filterable recurring invoices list.
   */
  public async getRecurringInvoices(
    filterDTO: GetRecurringInvoicesQueryDto,
  ): Promise<{
    data: RecurringInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const _filterDto = {
      sortOrder: 'ASC',
      columnSortBy: 'next_invoice_date',
      page: 1,
      pageSize: 12,
      ...filterDTO,
    };
    const filter = this.parseListFilterDTO(_filterDto);

    const dynamicFilter = await this.dynamicListService.dynamicList(
      this.recurringInvoiceModel(),
      filter,
    );

    const { results, pagination } = await this.recurringInvoiceModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries.item');
        builder.withGraphFetched('customer');

        dynamicFilter.buildQuery()(builder);
        _filterDto?.filterQuery?.(builder as any);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const data = await this.transformer.transform(
      results,
      new RecurringInvoiceTransformer(),
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
