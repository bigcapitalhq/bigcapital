import { Inject, Service } from 'typedi';
import { difference, upperFirst, omit } from 'lodash';
import moment from 'moment';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import {
  IContact,
  IContactNewDTO,
  IContactEditDTO,
  IContactsAutoCompleteFilter,
} from 'interfaces';
import JournalPoster from '../Accounting/JournalPoster';

type TContactService = 'customer' | 'vendor';

const ERRORS = {
  OPENING_BALANCE_DATE_REQUIRED: 'OPENING_BALANCE_DATE_REQUIRED',
};

@Service()
export default class ContactsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  /**
   * Get the given contact or throw not found contact.
   * @param {number} tenantId
   * @param {number} contactId
   * @param {TContactService} contactService
   * @return {Promise<IContact>}
   */
  public async getContactByIdOrThrowError(
    tenantId: number,
    contactId: number,
    contactService?: TContactService
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[contact] trying to validate contact existance.', {
      tenantId,
      contactId,
    });
    const contact = await contactRepository.findOne({
      id: contactId,
      ...(contactService && { contactService }),
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
    const baseCurrency = 'USD';
    const currencyCode = typeof contactDTO.currencyCode !== 'undefined'
    ? contactDTO.currencyCode
    : baseCurrency;

    return {
      ...omit(contactDTO, [
        'billingAddress1',
        'billingAddress2',
        'shippingAddress1',
        'shippingAddress2',
      ]),
      billing_address_1: contactDTO?.billingAddress1,
      billing_address_2: contactDTO?.billingAddress2,
      shipping_address_1: contactDTO?.shippingAddress1,
      shipping_address_2: contactDTO?.shippingAddress2,
      ...(currencyCode ? ({ currencyCode }) : {}),
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
    contactService: TContactService
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformContactObj(contactDTO);

    this.logger.info('[contacts] trying to insert contact to the storage.', {
      tenantId,
      contactDTO,
    });
    const contact = await contactRepository.create({
      contactService,
      ...contactObj,
    });
    this.logger.info('[contacts] contact inserted successfully.', {
      tenantId,
      contact,
    });
    return contact;
  }

  /**
   * Edit details of the given on the storage.
   * @param {number} tenantId
   * @param {number} contactId
   * @param {TContactService} contactService
   * @param {IContactDTO} contactDTO
   */
  async editContact(
    tenantId: number,
    contactId: number,
    contactDTO: IContactEditDTO,
    contactService: TContactService
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformContactObj(contactDTO);

    // Retrieve the given contact by id or throw not found service error.
    const contact = await this.getContactByIdOrThrowError(
      tenantId,
      contactId,
      contactService
    );
    this.logger.info('[contacts] trying to edit the given contact details.', {
      tenantId,
      contactId,
      contactDTO,
    });
    await contactRepository.update({ ...contactObj }, { id: contactId });
  }

  /**
   * Deletes the given contact from the storage.
   * @param {number} tenantId
   * @param {number} contactId
   * @param {TContactService} contactService
   * @return {Promise<void>}
   */
  async deleteContact(
    tenantId: number,
    contactId: number,
    contactService: TContactService
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contact = await this.getContactByIdOrThrowError(
      tenantId,
      contactId,
      contactService
    );

    this.logger.info('[contacts] trying to delete the given contact.', {
      tenantId,
      contactId,
    });

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
  async getContact(
    tenantId: number,
    contactId: number,
    contactService?: TContactService
  ) {
    return this.getContactByIdOrThrowError(tenantId, contactId, contactService);
  }

  /**
   * Retrieve auto-complete contacts list.
   * @param {number} tenantId -
   * @param {IContactsAutoCompleteFilter} contactsFilter -
   * @return {IContactAutoCompleteItem}
   */
  async autocompleteContacts(
    tenantId: number,
    contactsFilter: IContactsAutoCompleteFilter
  ) {
    const { Contact } = this.tenancy.models(tenantId);

    // Dynamic list.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Contact,
      contactsFilter
    );
    // Retrieve contacts list by the given query.
    const contacts = await Contact.query().onBuild((builder) => {
      if (contactsFilter.keyword) {
        builder.where('display_name', 'LIKE', `%${contactsFilter.keyword}%`);
      }
      dynamicList.buildQuery()(builder);
      builder.limit(contactsFilter.limit);
    });
    return contacts;
  }

  /**
   * Retrieve contacts or throw not found error if one of ids were not found
   * on the storage.
   * @param {number} tenantId
   * @param {number[]} contactsIds
   * @param {TContactService} contactService
   * @return {Promise<IContact>}
   */
  async getContactsOrThrowErrorNotFound(
    tenantId: number,
    contactsIds: number[],
    contactService: TContactService
  ) {
    const { Contact } = this.tenancy.models(tenantId);
    const contacts = await Contact.query()
      .whereIn('id', contactsIds)
      .where('contact_service', contactService);

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
  async deleteBulkContacts(
    tenantId: number,
    contactsIds: number[],
    contactService: TContactService
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given contacts or throw not found service error.
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

    // Loads the contact opening balance journal transactions.
    const contactsTransactions = await AccountTransaction.query()
      .whereIn('reference_id', contactsIds)
      .where('reference_type', `${upperFirst(contactService)}OpeningBalance`);

    journal.fromTransactions(contactsTransactions);
    journal.removeEntries();

    await Promise.all([journal.saveBalance(), journal.deleteEntries()]);
  }

  /**
   * Chanages the opening balance of the given contact.
   * @param {number} tenantId
   * @param {number} contactId
   * @param {ICustomerChangeOpeningBalanceDTO} changeOpeningBalance
   * @return {Promise<void>}
   */
  public async changeOpeningBalance(
    tenantId: number,
    contactId: number,
    contactService: string,
    openingBalance: number,
    openingBalanceAt?: Date | string
  ): Promise<void> {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given contact details or throw not found service error.
    const contact = await this.getContactByIdOrThrowError(
      tenantId,
      contactId,
      contactService
    );
    // Should the opening balance date be required.
    if (!contact.openingBalanceAt && !openingBalanceAt) {
      throw new ServiceError(ERRORS.OPENING_BALANCE_DATE_REQUIRED);
    }
    // Changes the customer the opening balance and opening balance date.
    await contactRepository.update(
      {
        openingBalance: openingBalance,

        ...(openingBalanceAt && {
          openingBalanceAt: moment(openingBalanceAt).toMySqlDateTime(),
        }),
      },
      {
        id: contactId,
        contactService,
      }
    );
  }
}
