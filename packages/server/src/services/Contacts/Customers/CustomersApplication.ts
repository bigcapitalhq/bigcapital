import {
  ICustomer,
  ICustomerEditDTO,
  ICustomerNewDTO,
  ICustomerOpeningBalanceEditDTO,
  ICustomersFilter,
  ISystemUser,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { CreateCustomer } from './CRUD/CreateCustomer';
import { DeleteCustomer } from './CRUD/DeleteCustomer';
import { EditCustomer } from './CRUD/EditCustomer';
import { EditOpeningBalanceCustomer } from './CRUD/EditOpeningBalanceCustomer';
import { GetCustomer } from './CRUD/GetCustomer';
import { GetCustomers } from './CRUD/GetCustomers';

@Service()
export class CustomersApplication {
  @Inject()
  private getCustomerService: GetCustomer;

  @Inject()
  private createCustomerService: CreateCustomer;

  @Inject()
  private editCustomerService: EditCustomer;

  @Inject()
  private deleteCustomerService: DeleteCustomer;

  @Inject()
  private editOpeningBalanceService: EditOpeningBalanceCustomer;

  @Inject()
  private getCustomersService: GetCustomers;

  /**
   * Retrieves the given customer details.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public getCustomer = (tenantId: number, customerId: number) => {
    return this.getCustomerService.getCustomer(tenantId, customerId);
  };

  /**
   * Creates a new customer.
   * @param   {number} tenantId
   * @param   {ICustomerNewDTO} customerDTO
   * @param   {ISystemUser} authorizedUser
   * @returns {Promise<ICustomer>}
   */
  public createCustomer = (
    tenantId: number,
    customerDTO: ICustomerNewDTO,
    authorizedUser: ISystemUser
  ) => {
    return this.createCustomerService.createCustomer(
      tenantId,
      customerDTO,
      authorizedUser
    );
  };

  /**
   * Edits details of the given customer.
   * @param  {number} tenantId
   * @param  {number} customerId
   * @param  {ICustomerEditDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public editCustomer = (
    tenantId: number,
    customerId: number,
    customerDTO: ICustomerEditDTO
  ) => {
    return this.editCustomerService.editCustomer(
      tenantId,
      customerId,
      customerDTO
    );
  };

  /**
   * Deletes the given customer and associated transactions.
   * @param   {number} tenantId
   * @param   {number} customerId
   * @param   {ISystemUser} authorizedUser
   * @returns {Promise<void>}
   */
  public deleteCustomer = (
    tenantId: number,
    customerId: number,
    authorizedUser: ISystemUser
  ) => {
    return this.deleteCustomerService.deleteCustomer(
      tenantId,
      customerId,
      authorizedUser
    );
  };

  /**
   * Changes the opening balance of the given customer.
   * @param   {number} tenantId
   * @param   {number} customerId
   * @param   {Date|string} openingBalanceEditDTO
   * @returns {Promise<ICustomer>}
   */
  public editOpeningBalance = (
    tenantId: number,
    customerId: number,
    openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO
  ): Promise<ICustomer> => {
    return this.editOpeningBalanceService.changeOpeningBalance(
      tenantId,
      customerId,
      openingBalanceEditDTO
    );
  };

  /**
   * Retrieve customers paginated list.
   * @param {number} tenantId - Tenant id.
   * @param {ICustomersFilter} filter - Customers filter.
   */
  public getCustomers = (tenantId: number, filterDTO: ICustomersFilter) => {
    return this.getCustomersService.getCustomersList(tenantId, filterDTO);
  };
}
