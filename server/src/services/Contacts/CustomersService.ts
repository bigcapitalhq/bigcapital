import { Inject, Service } from 'typedi';
import { omit, defaultTo } from 'lodash';
import * as R from 'ramda';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalCommands from 'services/Accounting/JournalCommands';
import ContactsService from 'services/Contacts/ContactsService';
import moment from 'moment';
import {
  ICustomerNewDTO,
  ICustomerEditDTO,
  ICustomer,
  IPaginationMeta,
  ICustomersFilter,
  IContactNewDTO,
  IContactEditDTO,
  IContact,
  ISystemUser,
  ISalesInvoicesService,
  ISalesReceiptsService,
  ISalesEstimatesService,
  IPaymentsReceiveService,
} from 'interfaces';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import events from 'subscribers/events';
import CustomerTransfromer from './Customers/CustomerTransformer';

const ERRORS = {
  CUSTOMER_HAS_TRANSACTIONS: 'CUSTOMER_HAS_TRANSACTIONS',
};
@Service()
export default class CustomersService {
  @Inject()
  contactService: ContactsService;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('SalesInvoices')
  invoicesService: ISalesInvoicesService;

  @Inject('SalesReceipts')
  receiptsService: ISalesReceiptsService;

  @Inject('PaymentReceives')
  paymentsService: IPaymentsReceiveService;

  @Inject('SalesEstimates')
  estimatesService: ISalesEstimatesService;

  @Inject()
  customerTransformer: CustomerTransfromer;

  /**
   * Converts customer to contact DTO.
   * @param {ICustomerNewDTO|ICustomerEditDTO} customerDTO
   * @returns {IContactDTO}
   */
  private customerToContactDTO(
    customerDTO: ICustomerNewDTO | ICustomerEditDTO
  ): IContactNewDTO | IContactEditDTO {
    return {
      ...omit(customerDTO, ['customerType']),
      contactType: customerDTO.customerType,
      active: defaultTo(customerDTO.active, true),
    };
  }

  /**
   * Transforms new customer DTO to contact.
   * @param customerDTO
   */
  private transformNewCustomerDTO(
    customerDTO: ICustomerNewDTO
  ): IContactNewDTO {
    return {
      ...this.customerToContactDTO(customerDTO),
      openingBalanceAt: customerDTO?.openingBalanceAt
        ? moment(customerDTO.openingBalanceAt).toMySqlDateTime()
        : null,
    };
  }

  /**
   * Transforms the contact model to customer model.
   * @param {IContact} contactModel
   */
  private transformContactToCustomer(contactModel: IContact) {
    return {
      ...omit(contactModel.toJSON(), ['contactService', 'contactType']),
      customerType: contactModel.contactType,
    };
  }

  /**
   * Creates a new customer.
   * @param {number} tenantId
   * @param {ICustomerNewDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async newCustomer(
    tenantId: number,
    customerDTO: ICustomerNewDTO,
    authorizedUser: ISystemUser
  ): Promise<ICustomer> {
    this.logger.info('[customer] trying to create a new customer.', {
      tenantId,
      customerDTO,
    });
    const customerObj = this.transformNewCustomerDTO(customerDTO);

    const customer = await this.contactService.newContact(
      tenantId,
      customerObj,
      'customer'
    );
    this.logger.info('[customer] created successfully.', {
      tenantId,
      customerDTO,
    });
    await this.eventDispatcher.dispatch(events.customers.onCreated, {
      customer,
      tenantId,
      customerId: customer.id,
      authorizedUser,
    });

    return customer;
  }

  /**
   * Edits details of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {ICustomerEditDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async editCustomer(
    tenantId: number,
    customerId: number,
    customerDTO: ICustomerEditDTO,
    authorizedUser: ISystemUser
  ): Promise<ICustomer> {
    const contactDTO = this.customerToContactDTO(customerDTO);

    this.logger.info('[customer] trying to edit customer.', {
      tenantId,
      customerId,
      customerDTO,
    });
    const customer = this.contactService.editContact(
      tenantId,
      customerId,
      contactDTO,
      'customer'
    );

    // Triggers `onCustomerEdited` event.
    this.eventDispatcher.dispatch(events.customers.onEdited);
    this.logger.info('[customer] edited successfully.', {
      tenantId,
      customerId,
      customer,
      authorizedUser,
    });

    return customer;
  }

  /**
   * Validate the customer associated relations.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  private async validateCustomerAssociatedRelations(
    tenantId: number,
    customerId: number
  ) {
    try {
      // Validate whether the customer has no associated estimates transactions.
      await this.estimatesService.validateCustomerHasNoEstimates(
        tenantId,
        customerId
      );
      // Validate whether the customer has no assocaited invoices tranasctions.
      await this.invoicesService.validateCustomerHasNoInvoices(
        tenantId,
        customerId
      );
      // Validate whether the customer has no associated receipts transactions.
      await this.receiptsService.validateCustomerHasNoReceipts(
        tenantId,
        customerId
      );
      // Validate whether the customer has no associated payment receives transactions.
      await this.paymentsService.validateCustomerHasNoPayments(
        tenantId,
        customerId
      );
    } catch (error) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_TRANSACTIONS);
    }
  }
  /**
   * Deletes the given customer from the storage.
   * @param {number} tenantId
   * @param {number} customerId
   * @return {Promise<void>}
   */
  public async deleteCustomer(
    tenantId: number,
    customerId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    this.logger.info('[customer] trying to delete customer.', {
      tenantId,
      customerId,
    });
    // Retrieve the customer of throw not found service error.
    await this.getCustomerByIdOrThrowError(tenantId, customerId);

    // Validate the customer associated relations.
    await this.validateCustomerAssociatedRelations(tenantId, customerId);

    // Delete the customer from the storage.
    await this.contactService.deleteContact(tenantId, customerId, 'customer');

    // Throws `onCustomerDeleted` event.
    await this.eventDispatcher.dispatch(events.customers.onDeleted, {
      tenantId,
      customerId,
    });
    this.logger.info('[customer] deleted successfully.', {
      tenantId,
      customerId,
      authorizedUser,
    });
  }

  /**
   * Retrieve the given customer details.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public async getCustomer(
    tenantId: number,
    customerId: number,
    authorizedUser: ISystemUser
  ) {
    const contact = await this.contactService.getContact(
      tenantId,
      customerId,
      'customer'
    );
    return R.compose(
      this.customerTransformer.transform,
      this.transformContactToCustomer,
    )(contact);
  }

  /**
   * Parses customers list filter DTO.
   * @param filterDTO - 
   */
  private parseCustomersListFilterDTO(filterDTO) {
    return R.compose(
      this.dynamicListService.parseStringifiedFilter
    )(filterDTO);
  }

  /**
   * Retrieve customers paginated list.
   * @param {number} tenantId - Tenant id.
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  public async getCustomersList(
    tenantId: number,
    filterDTO: ICustomersFilter
  ): Promise<{
    customers: ICustomer[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Customer } = this.tenancy.models(tenantId);

    // Parses customers list filter DTO.
    const filter = this.parseCustomersListFilterDTO(filterDTO);

    // Dynamic list.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Customer,
      filter
    );

    // Customers.
    const { results, pagination } = await Customer.query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    return {
      customers: results.map(this.transformContactToCustomer),
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
  public async writeCustomerOpeningBalanceJournal(
    tenantId: number,
    customerId: number,
    openingBalance: number,
    openingBalanceAt: Date | string,
    authorizedUserId: number
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    await journalCommands.customerOpeningBalance(
      customerId,
      openingBalance,
      openingBalanceAt,
      authorizedUserId
    );
    await Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
      journal.saveContactsBalance(),
    ]);
  }

  /**
   * Reverts customer opening balance journal entries.
   * @param {number} tenantId -
   * @param {number} customerId -
   * @return {Promise<void>}
   */
  public async revertOpeningBalanceEntries(
    tenantId: number,
    customerId: number | number[]
  ) {
    const id = Array.isArray(customerId) ? customerId : [customerId];

    this.logger.info(
      '[customer] trying to revert opening balance journal entries.',
      { tenantId, customerId }
    );
    await this.contactService.revertJEntriesContactsOpeningBalance(
      tenantId,
      id,
      'customer'
    );
  }

  /**
   * Retrieve the given customer by id or throw not found.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public getCustomerByIdOrThrowError(tenantId: number, customerId: number) {
    return this.contactService.getContactByIdOrThrowError(
      tenantId,
      customerId,
      'customer'
    );
  }

  /**
   * Changes the opening balance of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {number} openingBalance
   * @param {string|Date} openingBalanceAt
   */
  public async changeOpeningBalance(
    tenantId: number,
    customerId: number,
    openingBalance: number,
    openingBalanceAt: Date | string
  ) {
    await this.contactService.changeOpeningBalance(
      tenantId,
      customerId,
      'customer',
      openingBalance,
      openingBalanceAt
    );
    // Triggers `onOpeingBalanceChanged` event.
    await this.eventDispatcher.dispatch(
      events.customers.onOpeningBalanceChanged,
      {
        tenantId,
        customerId,
        openingBalance,
        openingBalanceAt,
      }
    );
  }
}
