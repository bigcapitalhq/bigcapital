import { Inject, Service } from 'typedi';
import { difference } from 'lodash';
import JournalPoster from "services/Accounting/JournalPoster";
import JournalCommands from "services/Accounting/JournalCommands";
import ContactsService from 'services/Contacts/ContactsService';
import { 
  IVendorNewDTO,
  IVendorEditDTO,
  IVendor
 } from 'interfaces';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';

@Service()
export default class VendorsService {
  @Inject()
  contactService: ContactsService;

  @Inject()
  tenancy: TenancyService;

  /**
   * Converts vendor to contact DTO.
   * @param {IVendorNewDTO|IVendorEditDTO} vendorDTO 
   * @returns {IContactDTO}
   */
  vendorToContactDTO(vendorDTO: IVendorNewDTO|IVendorEditDTO) {
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
  async newVendor(tenantId: number, vendorDTO: IVendorNewDTO) {
    const contactDTO = this.vendorToContactDTO(vendorDTO);

    const vendor = await this.contactService.newContact(tenantId, contactDTO, 'vendor');

    // Writes the vendor opening balance journal entries.
    if (vendor.openingBalance) { 
      await this.writeVendorOpeningBalanceJournal(
        tenantId,
        vendor.id,
        vendor.openingBalance,
      );
    }
    return vendor;
  }

  /**
   * Edits details of the given vendor.
   * @param {number} tenantId 
   * @param {IVendorEditDTO} vendorDTO 
   */
  async editVendor(tenantId: number, vendorId: number, vendorDTO: IVendorEditDTO) {
    const contactDTO = this.vendorToContactDTO(vendorDTO);
    return this.contactService.editContact(tenantId, vendorId, contactDTO, 'vendor');
  }

  /**
   * Retrieve the given vendor details by id or throw not found.
   * @param {number} tenantId 
   * @param {number} customerId 
   */
  getVendorByIdOrThrowError(tenantId: number, customerId: number) {
    return this.contactService.getContactByIdOrThrowError(tenantId, customerId, 'vendor');
  }

  /**
   * Deletes the given vendor from the storage.
   * @param {number} tenantId 
   * @param {number} vendorId 
   * @return {Promise<void>}
   */
  async deleteVendor(tenantId: number, vendorId: number) {
    const { Contact } = this.tenancy.models(tenantId);
    
    await this.getVendorByIdOrThrowError(tenantId, vendorId);
    await this.vendorHasNoBillsOrThrowError(tenantId, vendorId);

    await Contact.query().findById(vendorId).delete();

    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId, [vendorId], 'vendor',
    );
  }

  /**
   * Retrieve the given vendor details.
   * @param {number} tenantId 
   * @param {number} vendorId 
   */
  async getVendor(tenantId: number, vendorId: number) {
    return this.contactService.getContact(tenantId, vendorId, 'vendor');
  }

  /**
   * Writes vendor opening balance journal entries.
   * @param {number} tenantId 
   * @param {number} vendorId 
   * @param {number} openingBalance 
   * @return {Promise<void>}
   */
  async writeVendorOpeningBalanceJournal(
    tenantId: number,
    vendorId: number,
    openingBalance: number,
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    await journalCommands.vendorOpeningBalance(vendorId, openingBalance)

    await Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
    ]);
  }

  /**
   * Retrieve the given vendors or throw error if one of them not found.
   * @param {numebr} tenantId 
   * @param {number[]} vendorsIds
   */
  getVendorsOrThrowErrorNotFound(tenantId: number, vendorsIds: number[]) {
    return this.contactService.getContactsOrThrowErrorNotFound(tenantId, vendorsIds, 'vendor');
  }

  /**
   * Deletes the given vendors from the storage.
   * @param {number} tenantId 
   * @param {number[]} vendorsIds 
   * @return {Promise<void>}
   */
  async deleteBulkVendors(tenantId: number, vendorsIds: number[]) {
    const { Contact } = this.tenancy.models(tenantId);
    
    await this.getVendorsOrThrowErrorNotFound(tenantId, vendorsIds);
    await this.vendorsHaveNoBillsOrThrowError(tenantId, vendorsIds);

    await Contact.query().whereIn('id', vendorsIds).delete();

    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId, vendorsIds, 'vendor',
    );
  }

  /**
   * Validates the vendor has no associated bills or throw service error.
   * @param {number} tenantId 
   * @param {number} vendorId 
   */
  async vendorHasNoBillsOrThrowError(tenantId: number, vendorId: number) {
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
  async vendorsHaveNoBillsOrThrowError(tenantId: number, vendorsIds: number[]) {
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
}
