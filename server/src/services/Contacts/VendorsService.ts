import { Inject, Service } from 'typedi';
import { difference, rest } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import JournalPoster from "services/Accounting/JournalPoster";
import JournalCommands from "services/Accounting/JournalCommands";
import ContactsService from 'services/Contacts/ContactsService';
import { 
  IVendorNewDTO,
  IVendorEditDTO,
  IVendor,
  IVendorsFilter
 } from 'interfaces';
import { ServiceError } from 'exceptions';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';
import events from 'subscribers/events';

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

  /**
   * Converts vendor to contact DTO.
   * @param {IVendorNewDTO|IVendorEditDTO} vendorDTO 
   * @returns {IContactDTO}
   */
  private vendorToContactDTO(vendorDTO: IVendorNewDTO|IVendorEditDTO) {
    return {
      ...vendorDTO,
      active: (typeof vendorDTO.active === 'undefined') ?
        true : vendorDTO.active,
    };
  }

  /**
   * Creates a new vendor.
   * @param {number} tenantId 
   * @param {IVendorNewDTO} vendorDTO 
   * @return {Promise<void>}
   */
  public async newVendor(tenantId: number, vendorDTO: IVendorNewDTO) {
    this.logger.info('[vendor] trying create a new vendor.', { tenantId, vendorDTO });

    const contactDTO = this.vendorToContactDTO(vendorDTO);
    const vendor = await this.contactService.newContact(tenantId, contactDTO, 'vendor');

    await this.eventDispatcher.dispatch(events.vendors.onCreated, {
      tenantId, vendorId: vendor.id, vendor,
    });
    return vendor;
  }

  /**
   * Edits details of the given vendor.
   * @param {number} tenantId 
   * @param {IVendorEditDTO} vendorDTO 
   */
  public async editVendor(tenantId: number, vendorId: number, vendorDTO: IVendorEditDTO) {
    const contactDTO = this.vendorToContactDTO(vendorDTO);
    const vendor = await this.contactService.editContact(tenantId, vendorId, contactDTO, 'vendor');

    await this.eventDispatcher.dispatch(events.vendors.onEdited);

    return vendor;
  }

  /**
   * Retrieve the given vendor details by id or throw not found.
   * @param {number} tenantId 
   * @param {number} customerId 
   */
  private getVendorByIdOrThrowError(tenantId: number, customerId: number) {
    return this.contactService.getContactByIdOrThrowError(tenantId, customerId, 'vendor');
  }

  /**
   * Deletes the given vendor from the storage.
   * @param {number} tenantId 
   * @param {number} vendorId 
   * @return {Promise<void>}
   */
  public async deleteVendor(tenantId: number, vendorId: number) {
    const { Contact } = this.tenancy.models(tenantId);

    await this.getVendorByIdOrThrowError(tenantId, vendorId);
    await this.vendorHasNoBillsOrThrowError(tenantId, vendorId);

    this.logger.info('[vendor] trying to delete vendor.', { tenantId, vendorId });
    await Contact.query().findById(vendorId).delete();

    await this.eventDispatcher.dispatch(events.vendors.onDeleted, { tenantId, vendorId });
    this.logger.info('[vendor] deleted successfully.', { tenantId, vendorId });
  }

  /**
   * Retrieve the given vendor details.
   * @param {number} tenantId 
   * @param {number} vendorId 
   */
  public async getVendor(tenantId: number, vendorId: number) {
    return this.contactService.getContact(tenantId, vendorId, 'vendor');
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
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    this.logger.info('[vendor] writing opening balance journal entries.', { tenantId, vendorId });
    await journalCommands.vendorOpeningBalance(vendorId, openingBalance)
    
    await Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
    ]);
  }

  /**
   * Reverts vendor opening balance journal entries.
   * @param {number} tenantId -
   * @param {number} vendorId -
   * @return {Promise<void>}
   */
  public async revertOpeningBalanceEntries(tenantId: number, vendorId: number|number[]) {
    const id = Array.isArray(vendorId) ? vendorId : [vendorId];

    this.logger.info('[customer] trying to revert opening balance journal entries.', { tenantId, customerId });
    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId, id, 'vendor',
    );
  }

  /**
   * Retrieve the given vendors or throw error if one of them not found.
   * @param {numebr} tenantId 
   * @param {number[]} vendorsIds
   */
  private getVendorsOrThrowErrorNotFound(tenantId: number, vendorsIds: number[]) {
    return this.contactService.getContactsOrThrowErrorNotFound(tenantId, vendorsIds, 'vendor');
  }

  /**
   * Deletes the given vendors from the storage.
   * @param {number} tenantId 
   * @param {number[]} vendorsIds 
   * @return {Promise<void>}
   */
  public async deleteBulkVendors(
    tenantId: number,
    vendorsIds: number[]
  ): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);

    await this.getVendorsOrThrowErrorNotFound(tenantId, vendorsIds);
    await this.vendorsHaveNoBillsOrThrowError(tenantId, vendorsIds);

    await Contact.query().whereIn('id', vendorsIds).delete();
    await this.eventDispatcher.dispatch(events.vendors.onBulkDeleted, { tenantId, vendorsIds });

    this.logger.info('[vendor] bulk deleted successfully.', { tenantId, vendorsIds });
  }

  /**
   * Validates the vendor has no associated bills or throw service error.
   * @param {number} tenantId 
   * @param {number} vendorId 
   */
  private async vendorHasNoBillsOrThrowError(tenantId: number, vendorId: number) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);
    const bills = await vendorRepository.getBills(vendorId);

    if (bills.length > 0) {
      throw new ServiceError('vendor_has_bills')
    }
  }

  /**
   * Throws error in case one of vendors have associated bills.
   * @param  {number} tenantId 
   * @param  {number[]} customersIds 
   * @throws {ServiceError}
   */
  private async vendorsHaveNoBillsOrThrowError(tenantId: number, vendorsIds: number[]) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    const vendorsWithBills = await vendorRepository.vendorsWithBills(vendorsIds);
    const vendorsIdsWithBills = vendorsWithBills
      .filter((vendor: IVendor) => vendor.bills.length > 0)
      .map((vendor: IVendor) => vendor.id);

    const vendorsHaveInvoices = difference(vendorsIds, vendorsIdsWithBills);

    if (vendorsHaveInvoices.length > 0) {
      throw new ServiceError('some_vendors_have_bills');
    }
  }

  /**
   * Retrieve vendors datatable list.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorsFilter} vendorsFilter - Vendors filter.
   */
  public async getVendorsList(tenantId: number, vendorsFilter: IVendorsFilter) {
    const { Vendor } = this.tenancy.models(tenantId);

    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, Vendor, vendorsFilter);

    const vendors = await Vendor.query().onBuild((builder) => {
      dynamicFilter.buildQuery()(builder);
    });
    return vendors;
  }
}
