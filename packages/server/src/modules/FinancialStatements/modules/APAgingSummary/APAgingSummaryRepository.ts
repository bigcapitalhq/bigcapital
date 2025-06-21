import { Inject, Injectable, Scope } from '@nestjs/common';
import { isEmpty, groupBy } from 'lodash';
import { ModelObject } from 'objection';
import { Bill } from '@/modules/Bills/models/Bill';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

@Injectable({ scope: Scope.REQUEST })
export class APAgingSummaryRepository {
  @Inject(Vendor.name)
  private readonly vendorModel: TenantModelProxy<typeof Vendor>;

  @Inject(Bill.name)
  private readonly billModel: TenantModelProxy<typeof Bill>;

  @Inject(TenancyContext)
  private readonly tenancyContext: TenancyContext;

  /**
   * A/P aging filter.
   * @param {APAgingSummaryQueryDto} filter
   */
  filter: APAgingSummaryQueryDto;

  /**
   * Due bills.
   * @param {Bill[]} dueBills
   */
  dueBills: Bill[];

  /**
   * Due bills by vendor id.
   * @param {Record<string, Bill[]>} dueBillsByVendorId
   */
  dueBillsByVendorId: Record<string, Bill[]>;

  /**
   * Overdue bills.
   * @param {Bill[]} overdueBills - overdue bills.
   */
  overdueBills: ModelObject<Bill>[];

  /**
   * Overdue bills by vendor id.
   * @param {Record<string, Bill[]>} overdueBillsByVendorId - Overdue bills by vendor id.
   */
  overdueBillsByVendorId: Record<string, Array<ModelObject<Bill>>>;

  /**
   * Vendors.
   * @param {Vendor[]} vendors
   */
  vendors: Vendor[];

  /**
   * Base currency.
   * @param {string} baseCurrency
   */
  baseCurrency: string;

  /**
   * Set the filter.
   * @param {APAgingSummaryQueryDto} filter
   */
  setFilter(filter: APAgingSummaryQueryDto) {
    this.filter = filter;
  }

  /**
   * Load the data.
   */
  async load() {
    await this.asyncBaseCurrency();
    await this.asyncVendors();
    await this.asyncDueBills();
    await this.asyncOverdueBills();
  }

  /**
   * Retrieve the base currency.
   * @returns {Promise<string>}
   */
  async asyncBaseCurrency() {
    const metadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = metadata.baseCurrency;
  }

  /**
   * Retrieve all vendors from the storage.
   */
  async asyncVendors() {
    // Retrieve all vendors from the storage.
    const vendors =
      this.filter.vendorsIds.length > 0
        ? await this.vendorModel().query().whereIn('id', this.filter.vendorsIds)
        : await this.vendorModel().query();

    this.vendors = vendors;
  }

  /**
   * Retrieve all overdue bills from the storage.
   */
  async asyncOverdueBills() {
    const commonQuery = (query) => {
      if (!isEmpty(this.filter.branchesIds)) {
        query.modify('filterByBranches', this.filter.branchesIds);
      }
    };
    const overdueBills = await this.billModel()
      .query()
      .modify('overdueBillsFromDate', this.filter.asDate)
      .onBuild(commonQuery);

    this.overdueBills = overdueBills;
    this.overdueBillsByVendorId = groupBy(overdueBills, 'vendorId');
  }

  /**
   * Retrieve all due bills from the storage.
   */
  async asyncDueBills() {
    const commonQuery = (query) => {
      if (!isEmpty(this.filter.branchesIds)) {
        query.modify('filterByBranches', this.filter.branchesIds);
      }
    };
    // Retrieve all due vendors bills.
    const dueBills = await this.billModel()
      .query()
      .modify('dueBillsFromDate', this.filter.asDate)
      .onBuild(commonQuery);

    this.dueBills = dueBills;
    this.dueBillsByVendorId = groupBy(dueBills, 'vendorId');
  }
}
