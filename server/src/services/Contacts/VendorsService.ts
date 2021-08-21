import { Inject, Service } from 'typedi';
import { defaultTo } from 'lodash';
import * as R from 'ramda';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalCommands from 'services/Accounting/JournalCommands';
import ContactsService from 'services/Contacts/ContactsService';
import {
  IVendorNewDTO,
  IVendorEditDTO,
  IVendor,
  IVendorsFilter,
  IPaginationMeta,
  IFilterMeta,
  ISystemUser,
  IBillsService,
  IBillPaymentsService,
} from 'interfaces';
import { ServiceError } from 'exceptions';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';
import events from 'subscribers/events';
import VendorTransfromer from './Vendors/VendorTransformer';

const ERRORS = {
  VENDOR_HAS_TRANSACTIONS: 'VENDOR_HAS_TRANSACTIONS',
};

@Service()
export default class VendorsService {
  @Inject()
  contactService: ContactsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  @Inject('Bills')
  billsService: IBillsService;

  @Inject('BillPayments')
  billPaymentsService: IBillPaymentsService;

  @Inject()
  vendorTransformer: VendorTransfromer;

  /**
   * Converts vendor to contact DTO.
   * @param {IVendorNewDTO|IVendorEditDTO} vendorDTO
   * @returns {IContactDTO}
   */
  private vendorToContactDTO(vendorDTO: IVendorNewDTO | IVendorEditDTO) {
    return {
      ...vendorDTO,
      active: defaultTo(vendorDTO.active, true),
    };
  }

  /**
   * Creates a new vendor.
   * @param {number} tenantId
   * @param {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public async newVendor(
    tenantId: number,
    vendorDTO: IVendorNewDTO,
    authorizedUser: ISystemUser
  ) {
    this.logger.info('[vendor] trying create a new vendor.', {
      tenantId,
      vendorDTO,
    });
    const contactDTO = this.vendorToContactDTO(vendorDTO);

    const vendor = await this.contactService.newContact(
      tenantId,
      contactDTO,
      'vendor'
    );
    // Triggers `onVendorCreated` event.
    await this.eventDispatcher.dispatch(events.vendors.onCreated, {
      tenantId,
      vendorId: vendor.id,
      vendor,
      authorizedUser,
    });
    return vendor;
  }

  /**
   * Edits details of the given vendor.
   * @param {number} tenantId
   * @param {IVendorEditDTO} vendorDTO
   */
  public async editVendor(
    tenantId: number,
    vendorId: number,
    vendorDTO: IVendorEditDTO,
    authorizedUser: ISystemUser
  ) {
    const contactDTO = this.vendorToContactDTO(vendorDTO);
    const vendor = await this.contactService.editContact(
      tenantId,
      vendorId,
      contactDTO,
      'vendor'
    );

    // Triggers `onVendorEdited` event.
    await this.eventDispatcher.dispatch(events.vendors.onEdited, {
      tenantId,
      vendorId,
      vendor,
      authorizedUser,
    });
    return vendor;
  }

  /**
   * Retrieve the given vendor details by id or throw not found.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public getVendorByIdOrThrowError(tenantId: number, customerId: number) {
    return this.contactService.getContactByIdOrThrowError(
      tenantId,
      customerId,
      'vendor'
    );
  }

  /**
   * Validate the given vendor has no associated transactions.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  private async validateAssociatedTransactions(
    tenantId: number,
    vendorId: number
  ) {
    try {
      // Validate vendor has no bills.
      await this.billsService.validateVendorHasNoBills(tenantId, vendorId);

      // Validate vendor has no paymentys.
      await this.billPaymentsService.validateVendorHasNoPayments(
        tenantId,
        vendorId
      );
    } catch (error) {
      throw new ServiceError(ERRORS.VENDOR_HAS_TRANSACTIONS);
    }
  }

  /**
   * Deletes the given vendor from the storage.
   * @param {number} tenantId
   * @param {number} vendorId
   * @return {Promise<void>}
   */
  public async deleteVendor(
    tenantId: number,
    vendorId: number,
    authorizedUser: ISystemUser
  ) {
    // Validate the vendor existance on the storage.
    await this.getVendorByIdOrThrowError(tenantId, vendorId);

    // Validate associated vendor transactions.
    await this.validateAssociatedTransactions(tenantId, vendorId);

    this.logger.info('[vendor] trying to delete vendor.', {
      tenantId,
      vendorId,
    });
    await this.contactService.deleteContact(tenantId, vendorId, 'vendor');

    // Triggers `onVendorDeleted` event.
    await this.eventDispatcher.dispatch(events.vendors.onDeleted, {
      tenantId,
      vendorId,
      authorizedUser,
    });
    this.logger.info('[vendor] deleted successfully.', { tenantId, vendorId });
  }

  /**
   * Retrieve the given vendor details.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public async getVendor(tenantId: number, vendorId: number) {
    const vendor = this.contactService.getContact(tenantId, vendorId, 'vendor');

    return this.vendorTransformer.transform(vendor);
  }

  /**
   * Writes vendor opening balance journal entries.
   * @param {number} tenantId
   * @param {number} vendorId
   * @param {number} openingBalance
   * @return {Promise<void>}
   */
  public async writeVendorOpeningBalanceJournal(
    tenantId: number,
    vendorId: number,
    openingBalance: number,
    openingBalanceAt: Date | string,
    user: ISystemUser
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    this.logger.info('[vendor] writing opening balance journal entries.', {
      tenantId,
      vendorId,
    });
    await journalCommands.vendorOpeningBalance(
      vendorId,
      openingBalance,
      openingBalanceAt,
      user
    );
    await Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
      journal.saveContactsBalance(),
    ]);
  }

  /**
   * Reverts vendor opening balance journal entries.
   * @param {number} tenantId -
   * @param {number} vendorId -
   * @return {Promise<void>}
   */
  public async revertOpeningBalanceEntries(
    tenantId: number,
    vendorId: number | number[]
  ) {
    const id = Array.isArray(vendorId) ? vendorId : [vendorId];

    this.logger.info(
      '[customer] trying to revert opening balance journal entries.',
      { tenantId, vendorId }
    );
    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId,
      id,
      'vendor'
    );
  }

  private parseVendorsListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve vendors datatable list.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorsFilter} vendorsFilter - Vendors filter.
   */
  public async getVendorsList(
    tenantId: number,
    filterDTO: IVendorsFilter
  ): Promise<{
    vendors: IVendor[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Vendor } = this.tenancy.models(tenantId);

    // Parses vendors list filter DTO.
    const filter = this.parseVendorsListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Vendor,
      filter
    );
    // Vendors list.
    const { results, pagination } = await Vendor.query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);

        // Switches between active/inactive modes.
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    return {
      vendors: this.vendorTransformer.transform(results),
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Changes the opeing balance of the given vendor.
   * @param {number} tenantId
   * @param {number} vendorId
   * @param {number} openingBalance
   * @param {Date|string} openingBalanceAt
   */
  public async changeOpeningBalance(
    tenantId: number,
    vendorId: number,
    openingBalance: number,
    openingBalanceAt: Date | string
  ): Promise<void> {
    await this.contactService.changeOpeningBalance(
      tenantId,
      vendorId,
      'vendor',
      openingBalance,
      openingBalanceAt
    );
    // Triggers `onOpeingBalanceChanged` event.
    await this.eventDispatcher.dispatch(
      events.vendors.onOpeningBalanceChanged,
      {
        tenantId,
        vendorId,
        openingBalance,
        openingBalanceAt,
      }
    );
  }
}
