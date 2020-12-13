import { Inject, Service } from 'typedi';
import { difference, upperFirst, omit } from 'lodash';
import { ServiceError } from "exceptions";
import TenancyService from 'services/Tenancy/TenancyService';
import {
  IContact,
  IContactNewDTO,
  IContactEditDTO,
 } from "interfaces";
import JournalPoster from '../Accounting/JournalPoster';

type TContactService = 'customer' | 'vendor';

@Service()
export default class ContactsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Get the given contact or throw not found contact.
   * @param {number} tenantId 
   * @param {number} contactId 
   * @param {TContactService} contactService
   * @return {Promise<IContact>}
   */
  public async getContactByIdOrThrowError(tenantId: number, contactId: number, contactService: TContactService) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[contact] trying to validate contact existance.', { tenantId, contactId });
    const contact = await contactRepository.findOne({
      id: contactId,
      contactService: contactService,
    });

    if (!contact) {
      throw new ServiceError('contact_not_found');
    }
    return contact;
  }

  /**
   * Converts contact DTO object to model object attributes to insert or update.
   * @param {IContactNewDTO | IContactEditDTO} contactDTO 
   */
  private transformContactObj(contactDTO: IContactNewDTO | IContactEditDTO) {
    return {
      ...omit(contactDTO, [
        'billingAddress1', 'billingAddress2',
        'shippingAddress1', 'shippingAddress2',
      ]),
      billing_address_1: contactDTO?.billingAddress1,
      billing_address_2: contactDTO?.billingAddress2,
      shipping_address_1: contactDTO?.shippingAddress1,
      shipping_address_2: contactDTO?.shippingAddress2,
    };
  }

  /**
   * Creates a new contact on the storage.
   * @param {number} tenantId 
   * @param {TContactService} contactService
   * @param {IContactDTO} contactDTO 
   */
  async newContact(
    tenantId: number,
    contactDTO: IContactNewDTO,
    contactService: TContactService,
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformContactObj(contactDTO);

    this.logger.info('[contacts] trying to insert contact to the storage.', { tenantId, contactDTO });
    const contact = await contactRepository.create({ contactService, ...contactObj });

    this.logger.info('[contacts] contact inserted successfully.', { tenantId, contact });
    return contact;
  }

  /**
   * Edit details of the given on the storage.
   * @param {number} tenantId 
   * @param {number} contactId 
   * @param {TContactService} contactService
   * @param {IContactDTO} contactDTO 
   */
  async editContact(tenantId: number, contactId: number, contactDTO: IContactEditDTO, contactService: TContactService) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformContactObj(contactDTO);

    const contact = await this.getContactByIdOrThrowError(tenantId, contactId, contactService);

    this.logger.info('[contacts] trying to edit the given contact details.', { tenantId, contactId, contactDTO });
    await contactRepository.update({ ...contactObj }, { id: contactId });
  }

  /**
   * Deletes the given contact from the storage.
   * @param {number} tenantId 
   * @param {number} contactId
   * @param {TContactService} contactService 
   * @return {Promise<void>}
   */
  async deleteContact(tenantId: number, contactId: number, contactService: TContactService) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contact = await this.getContactByIdOrThrowError(tenantId, contactId, contactService);

    this.logger.info('[contacts] trying to delete the given contact.', { tenantId, contactId });

    // Deletes contact of the given id.
    await contactRepository.deleteById(contactId);
  }

  /**
   * Get contact details of the given contact id.
   * @param {number} tenantId 
   * @param {number} contactId 
   * @param {TContactService} contactService
   * @returns {Promise<IContact>}
   */
  async getContact(tenantId: number, contactId: number, contactService: TContactService) {
    return this.getContactByIdOrThrowError(tenantId, contactId, contactService);
  }

  /**
   * Retrieve contacts or throw not found error if one of ids were not found
   * on the storage.
   * @param {number} tenantId 
   * @param {number[]} contactsIds 
   * @param {TContactService} contactService
   * @return {Promise<IContact>}
   */
  async getContactsOrThrowErrorNotFound(tenantId: number, contactsIds: number[], contactService: TContactService) {
    const { Contact } = this.tenancy.models(tenantId);
    const contacts = await Contact.query().whereIn('id', contactsIds).where('contact_service', contactService);
    const storedContactsIds = contacts.map((contact: IContact) => contact.id);

    const notFoundCustomers = difference(contactsIds, storedContactsIds);

    if (notFoundCustomers.length > 0) {
      throw new ServiceError('contacts_not_found');
    }
    return contacts;
  }

  /**
   * Deletes the given contacts in bulk.
   * @param  {number} tenantId 
   * @param  {number[]} contactsIds 
   * @param  {TContactService} contactService
   * @return {Promise<void>}
   */
  async deleteBulkContacts(tenantId: number, contactsIds: number[], contactService: TContactService) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    this.getContactsOrThrowErrorNotFound(tenantId, contactsIds, contactService);

    await contactRepository.deleteWhereIdIn(contactsIds);
  }

  /**
   * Reverts journal entries of the given contacts.
   * @param {number} tenantId 
   * @param {number[]} contactsIds 
   * @param {TContactService} contactService 
   */
  async revertJEntriesContactsOpeningBalance(
    tenantId: number,
    contactsIds: number[],
    contactService: TContactService
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const journal = new JournalPoster(tenantId);

    const contactsTransactions = await AccountTransaction.query()
      .whereIn('reference_id', contactsIds)
      .where('reference_type', `${upperFirst(contactService)}OpeningBalance`);

    journal.loadEntries(contactsTransactions);
    journal.removeEntries();

    await Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
    ]);
  }
}