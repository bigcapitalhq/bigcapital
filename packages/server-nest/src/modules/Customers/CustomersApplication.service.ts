import { Injectable } from '@nestjs/common';
import { GetCustomerService } from './queries/GetCustomer.service';
import { CreateCustomer } from './commands/CreateCustomer.service';
import { EditCustomer } from './commands/EditCustomer.service';
import { DeleteCustomer } from './commands/DeleteCustomer.service';
import { EditOpeningBalanceCustomer } from './commands/EditOpeningBalanceCustomer.service';
import {
  ICustomerEditDTO,
  ICustomerNewDTO,
  ICustomerOpeningBalanceEditDTO,
  // ICustomersFilter,
} from './types/Customers.types';

@Injectable()
export class CustomersApplication {
  constructor(
    private getCustomerService: GetCustomerService,
    private createCustomerService: CreateCustomer,
    private editCustomerService: EditCustomer,
    private deleteCustomerService: DeleteCustomer,
    private editOpeningBalanceService: EditOpeningBalanceCustomer,
    // private getCustomersService: GetCustomers,
  ) {}

  /**
   * Retrieves the given customer details.
   * @param {number} tenantId
   * @param {number} customerId
   */
  public getCustomer = (customerId: number) => {
    return this.getCustomerService.getCustomer(customerId);
  };

  /**
   * Creates a new customer.
   * @param {ICustomerNewDTO} customerDTO
   * @returns {Promise<ICustomer>}
   */
  public createCustomer = (customerDTO: ICustomerNewDTO) => {
    return this.createCustomerService.createCustomer(customerDTO);
  };

  /**
   * Edits details of the given customer.
   * @param {number} customerId - Customer id.
   * @param {ICustomerEditDTO} customerDTO - Customer edit DTO.
   * @return {Promise<ICustomer>}
   */
  public editCustomer = (customerId: number, customerDTO: ICustomerEditDTO) => {
    return this.editCustomerService.editCustomer(customerId, customerDTO);
  };

  /**
   * Deletes the given customer and associated transactions.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {ISystemUser} authorizedUser
   * @returns {Promise<void>}
   */
  public deleteCustomer = (customerId: number) => {
    return this.deleteCustomerService.deleteCustomer(customerId);
  };

  /**
   * Changes the opening balance of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {Date|string} openingBalanceEditDTO
   * @returns {Promise<ICustomer>}
   */
  public editOpeningBalance = (
    customerId: number,
    openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO,
  ) => {
    return this.editOpeningBalanceService.changeOpeningBalance(
      customerId,
      openingBalanceEditDTO,
    );
  };

  /**
   * Retrieve customers paginated list.
   * @param {number} tenantId - Tenant id.
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  // public getCustomers = (filterDTO: ICustomersFilter) => {
  // return this.getCustomersService.getCustomersList(filterDTO);
  // };
}
