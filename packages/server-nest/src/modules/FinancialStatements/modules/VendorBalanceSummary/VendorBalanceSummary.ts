import * as R from 'ramda';
import { isEmpty } from 'lodash';
import { ModelObject } from 'objection';
import {
  IVendorBalanceSummaryVendor,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryData,
} from './VendorBalanceSummary.types';
import { ContactBalanceSummaryReport } from '../ContactBalanceSummary/ContactBalanceSummary';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { INumberFormatQuery } from '../../types/Report.types';
import { VendorBalanceSummaryRepository } from './VendorBalanceSummaryRepository';

export class VendorBalanceSummaryReport extends ContactBalanceSummaryReport {
  readonly filter: IVendorBalanceSummaryQuery;
  readonly numberFormat: INumberFormatQuery;
  readonly repo: VendorBalanceSummaryRepository;

  /**
   * Constructor method.
   * @param {IJournalPoster} receivableLedger
   * @param {IVendor[]} vendors
   * @param {IVendorBalanceSummaryQuery} filter
   * @param {string} baseCurrency
   */
  constructor(
    repo: VendorBalanceSummaryRepository,
    filter: IVendorBalanceSummaryQuery,
  ) {
    super();

    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Customer section mapper.
   * @param {ModelObject<Vendor>} vendor
   * @returns {IVendorBalanceSummaryVendor}
   */
  private vendorMapper = (
    vendor: ModelObject<Vendor>,
  ): IVendorBalanceSummaryVendor => {
    const closingBalance = this.repo.ledger
      .whereContactId(vendor.id)
      .getClosingBalance();

    return {
      id: vendor.id,
      vendorName: vendor.displayName,
      total: this.getContactTotalFormat(closingBalance),
    };
  };

  /**
   * Mappes the vendor model object to vendor balance summary section.
   * @param {ModelObject<Vendor>[]} vendors - Customers.
   * @returns {IVendorBalanceSummaryVendor[]}
   */
  private vendorsMapper = (
    vendors: ModelObject<Vendor>[],
  ): IVendorBalanceSummaryVendor[] => {
    return vendors.map(this.vendorMapper);
  };

  /**
   * Detarmines whether the vendors post filter is active.
   * @returns {boolean}
   */
  private isVendorsPostFilter = (): boolean => {
    return isEmpty(this.filter.vendorsIds);
  };

  /**
   * Retrieve the vendors sections of the report.
   * @param {ModelObject<Vendor>} vendors
   * @returns {IVendorBalanceSummaryVendor[]}
   */
  private getVendorsSection(
    vendors: ModelObject<Vendor>[],
  ): IVendorBalanceSummaryVendor[] {
    return R.compose(
      R.when(this.isVendorsPostFilter, this.contactsFilter),
      R.when(
        R.always(this.filter.percentageColumn),
        this.contactCamparsionPercentageOfColumn,
      ),
      this.vendorsMapper,
    )(vendors);
  }

  /**
   * Retrieve the report statement data.
   * @returns {IVendorBalanceSummaryData}
   */
  public reportData(): IVendorBalanceSummaryData {
    const vendors = this.getVendorsSection(this.repo.vendors);
    const total = this.getContactsTotalSection(vendors);

    return { vendors, total };
  }
}
