import { Inject, Service } from 'typedi';
import { omit, difference } from 'lodash';
import JournalPoster from "services/Accounting/JournalPoster";
import JournalCommands from "services/Accounting/JournalCommands";
import ContactsService from 'services/Contacts/ContactsService';
import { 
  ICustomerNewDTO,
  ICustomerEditDTO,
  ICustomer,
  IPaginationMeta,
  ICustomersFilter
 } from 'interfaces';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class CustomersService {
  @Inject()
  contactService: ContactsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Converts customer to contact DTO.
   * @param {ICustomerNewDTO|ICustomerEditDTO} customerDTO 
   * @returns {IContactDTO}
   */
  private customerToContactDTO(customerDTO: ICustomerNewDTO | ICustomerEditDTO) {
    return {
      ...omit(customerDTO, ['customerType']),
      contactType: customerDTO.customerType,
      active: (typeof customerDTO.active === 'undefined') ?
        true : customerDTO.active,
    };
  }

  /**
   * Creates a new customer.
   * @param {number} tenantId 
   * @param {ICustomerNewDTO} customerDTO 
   * @return {Promise<void>}
   */
  public async newCustomer(tenantId: number, customerDTO: ICustomerNewDTO) {
    const contactDTO = this.customerToContactDTO(customerDTO)
    const customer = await this.contactService.newContact(tenantId, contactDTO, 'customer');

    // Writes the customer opening balance journal entries.
    if (customer.openingBalance) {
      await this.writeCustomerOpeningBalanceJournal(
        tenantId,
        customer.id,
        customer.openingBalance,
      );
    }
    return customer;
  }

  /**
   * Edits details of the given customer.
   * @param {number} tenantId 
   * @param {ICustomerEditDTO} customerDTO 
   */
  public async editCustomer(tenantId: number, customerId: number, customerDTO: ICustomerEditDTO) {
    const contactDTO = this.customerToContactDTO(customerDTO);
    return this.contactService.editContact(tenantId, customerId, contactDTO, 'customer');
  }

  /**
   * Deletes the given customer from the storage.
   * @param {number} tenantId 
   * @param {number} customerId 
   * @return {Promise<void>}
   */
  public async deleteCustomer(tenantId: number, customerId: number) {
    const { Contact } = this.tenancy.models(tenantId);

    await this.getCustomerByIdOrThrowError(tenantId, customerId);
    await this.customerHasNoInvoicesOrThrowError(tenantId, customerId);

    await Contact.query().findById(customerId).delete();

    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId, [customerId], 'customer',
    );
  }

  /**
   * Retrieve the given customer details.
   * @param {number} tenantId 
   * @param {number} customerId 
   */
  public async getCustomer(tenantId: number, customerId: number) {
    return this.contactService.getContact(tenantId, customerId, 'customer');
  }

  /**
   * Retrieve customers paginated list.
   * @param {number} tenantId - Tenant id.
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  public async getCustomersList(
    tenantId: number,
    filter: ICustomersFilter
  ): Promise<{ customers: ICustomer[], pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { Contact } = this.tenancy.models(tenantId);
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, Contact, filter);

    const { results, pagination } = await Contact.query().onBuild((query) => {
      query.modify('customer');
      dynamicList.buildQuery()(query);
    });

    return {
      customers: results,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Writes customer opening balance journal entries.
   * @param {number} tenantId 
   * @param {number} customerId 
   * @param {number} openingBalance 
   * @return {Promise<void>}
   */
  async writeCustomerOpeningBalanceJournal(
    tenantId: number,
    customerId: number,
    openingBalance: number,
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    await journalCommands.customerOpeningBalance(customerId, openingBalance)

    await Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
    ]);
  }

  /**
   * Retrieve the given customer by id or throw not found.
   * @param {number} tenantId 
   * @param {number} customerId 
   */
  getCustomerByIdOrThrowError(tenantId: number, customerId: number) {
    return this.contactService.getContactByIdOrThrowError(tenantId, customerId, 'customer');
  }

  /**
   * Retrieve the given customers or throw error if one of them not found.
   * @param {numebr} tenantId 
   * @param {number[]} customersIds
   */
  getCustomersOrThrowErrorNotFound(tenantId: number, customersIds: number[]) {
    return this.contactService.getContactsOrThrowErrorNotFound(tenantId, customersIds, 'customer');
  }

  /**
   * Deletes the given customers from the storage.
   * @param {number} tenantId 
   * @param {number[]} customersIds 
   * @return {Promise<void>}
   */
  async deleteBulkCustomers(tenantId: number, customersIds: number[]) {
    const { Contact } = this.tenancy.models(tenantId);

    await this.getCustomersOrThrowErrorNotFound(tenantId, customersIds);
    await this.customersHaveNoInvoicesOrThrowError(tenantId, customersIds);

    await Contact.query().whereIn('id', customersIds).delete();

    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId,
      customersIds,
      'Customer'
    );
  }

  /**
   * Validates the customer has no associated sales invoice
   * or throw service error.
   * @param {number} tenantId 
   * @param {number} customerId 
   */
  async customerHasNoInvoicesOrThrowError(tenantId: number, customerId: number) {
    const { customerRepository } = this.tenancy.repositories(tenantId);
    const salesInvoice = await customerRepository.getSalesInvoices(customerId);

    if (salesInvoice.length > 0) {
      throw new ServiceError('customer_has_invoices');
    }
  }

  /**
   * Throws error in case one of customers have associated sales invoices.
   * @param  {number} tenantId 
   * @param  {number[]} customersIds 
   * @throws {ServiceError}
   */
  async customersHaveNoInvoicesOrThrowError(tenantId: number, customersIds: number[]) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    const customersWithInvoices = await customerRepository.customersWithSalesInvoices(
      customersIds,
    );
    const customersIdsWithInvoice = customersWithInvoices
      .filter((customer: ICustomer) => customer.salesInvoices.length > 0)
      .map((customer: ICustomer) => customer.id);

    const customersHaveInvoices = difference(customersIds, customersIdsWithInvoice);

    if (customersHaveInvoices.length > 0) {
      throw new ServiceError('some_customers_have_invoices');
    }
  }
}
