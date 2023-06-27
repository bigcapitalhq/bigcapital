import { Inject, Service } from 'typedi';
import { difference, upperFirst, omit } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import { Knex } from 'knex';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import {
  IContact,
  IContactNewDTO,
  IContactEditDTO,
  IContactsAutoCompleteFilter,
} from '@/interfaces';
import JournalPoster from '../Accounting/JournalPoster';
import { ERRORS } from './constants';

type TContactService = 'customer' | 'vendor';

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
  private commonTransformContactObj(
    contactDTO: IContactNewDTO | IContactEditDTO
  ) {
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
    };
  }

  /**
   * Transforms contact new DTO object to model object to insert to the storage.
   * @param {IContactNewDTO} contactDTO
   */
  private transformNewContactDTO(contactDTO: IContactNewDTO) {
    const baseCurrency = 'USD';
    const currencyCode =
      typeof contactDTO.currencyCode !== 'undefined'
        ? contactDTO.currencyCode
        : baseCurrency;

    return {
      ...this.commonTransformContactObj(contactDTO),
      ...(currencyCode ? { currencyCode } : {}),
    };
  }

  /**
   * Transforms contact edit DTO object to model object to update to the storage.
   * @param {IContactEditDTO} contactDTO
   */
  private transformEditContactDTO(contactDTO: IContactEditDTO) {
    return {
      ...this.commonTransformContactObj(contactDTO),
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
    trx?: Knex.Transaction
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformNewContactDTO(contactDTO);

    const contact = await contactRepository.create(
      {
        contactService,
        ...contactObj,
      },
      trx
    );
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
    contactService: TContactService,
    trx?: Knex.Transaction
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);
    const contactObj = this.transformEditContactDTO(contactDTO);

    // Retrieve the given contact by id or throw not found service error.
    const contact = await this.getContactByIdOrThrowError(
      tenantId,
      contactId,
      contactService
    );
    return contactRepository.update({ ...contactObj }, { id: contactId }, trx);
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
    contactService: TContactService,
    trx?: Knex.Transaction
  ) {
    const { contactRepository } = this.tenancy.repositories(tenantId);

    const contact = await this.getContactByIdOrThrowError(
      tenantId,
      contactId,
      contactService
    );
    // Deletes contact of the given id.
    await contactRepository.deleteById(contactId, trx);
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
   * Parses accounts list filter DTO.
   * @param filterDTO
   */
  private parseAutocompleteListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve auto-complete contacts list.
   * @param {number} tenantId -
   * @param {IContactsAutoCompleteFilter} contactsFilter -
   * @return {IContactAutoCompleteItem}
   */
  async autocompleteContacts(
    tenantId: number,
    query: IContactsAutoCompleteFilter
  ) {
    const { Contact } = this.tenancy.models(tenantId);

    // Parses auto-complete list filter DTO.
    const filter = this.parseAutocompleteListFilterDTO(query);

    // Dynamic list.
    // const dynamicList = await this.dynamicListService.dynamicList(
    //   tenantId,
    //   Contact,
    //   filter
    // );
    // Retrieve contacts list by the given query.
    const contacts = await Contact.query().onBuild((builder) => {
      if (filter.keyword) {
        builder.where('display_name', 'LIKE', `%${filter.keyword}%`);
      }
      // dynamicList.buildQuery()(builder);
      builder.limit(filter.limit);
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
    contactService: TContactService,
    trx?: Knex.Transaction
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const journal = new JournalPoster(tenantId, null, trx);

    // Loads the contact opening balance journal transactions.
    const contactsTransactions = await AccountTransaction.query()
      .whereIn('reference_id', contactsIds)
      .where('reference_type', `${upperFirst(contactService)}OpeningBalance`);

    journal.fromTransactions(contactsTransactions);
    journal.removeEntries();

    await Promise.all([journal.saveBalance(), journal.deleteEntries()]);
  }

  /**
   * Changes the opening balance of the given contact.
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

  /**
   * Inactive the given contact.
   * @param {number} tenantId - Tenant id.
   * @param {number} contactId - Contact id.
   */
  async inactivateContact(tenantId: number, contactId: number): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);
    const contact = await this.getContactByIdOrThrowError(tenantId, contactId);

    if (!contact.active) {
      throw new ServiceError(ERRORS.CONTACT_ALREADY_INACTIVE);
    }
    await Contact.query().findById(contactId).update({ active: false });
  }

  /**
   * Inactive the given contact.
   * @param {number} tenantId - Tenant id.
   * @param {number} contactId - Contact id.
   */
  async activateContact(tenantId: number, contactId: number): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);
    const contact = await this.getContactByIdOrThrowError(tenantId, contactId);

    if (contact.active) {
      throw new ServiceError(ERRORS.CONTACT_ALREADY_ACTIVE);
    }
    await Contact.query().findById(contactId).update({ active: true });
  }
}
