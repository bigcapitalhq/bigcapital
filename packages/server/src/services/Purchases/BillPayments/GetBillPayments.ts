import { Service } from 'typedi';
import { BillPaymentTransformer } from './BillPaymentTransformer';
import { IBillPayment, IFilterMeta, IPaginationMeta } from '@/interfaces';

@Service()
export class BillPayments {
  /**
   * Retrieve bill payment paginted and filterable list.
   * @param {number} tenantId
   * @param {IBillPaymentsFilter} billPaymentsFilter
   */
  public async listBillPayments(
    tenantId: number,
    filterDTO: IBillPaymentsFilter
  ): Promise<{
    billPayments: IBillPayment;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { BillPayment } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      BillPayment,
      filter
    );
    const { results, pagination } = await BillPayment.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('paymentAccount');

        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the bill payments models to POJO.
    const billPayments = await this.transformer.transform(
      tenantId,
      results,
      new BillPaymentTransformer()
    );
    return {
      billPayments,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }
}
