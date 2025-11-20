import { Injectable } from '@nestjs/common';
import { GetCustomerService } from './queries/GetCustomer.service';
import { CreateCustomer } from './commands/CreateCustomer.service';
import { EditCustomer } from './commands/EditCustomer.service';
import { DeleteCustomer } from './commands/DeleteCustomer.service';
import { EditOpeningBalanceCustomer } from './commands/EditOpeningBalanceCustomer.service';
import {
  ICustomerOpeningBalanceEditDTO,
  ICustomersFilter,
} from './types/Customers.types';
import { CreateCustomerDto } from './dtos/CreateCustomer.dto';
import { EditCustomerDto } from './dtos/EditCustomer.dto';
import { GetCustomers } from './queries/GetCustomers.service';
import { GetCustomersQueryDto } from './dtos/GetCustomersQuery.dto';
import { BulkDeleteCustomersService } from './BulkDeleteCustomers.service';
import { ValidateBulkDeleteCustomersService } from './ValidateBulkDeleteCustomers.service';

@Injectable()
export class CustomersApplication {
  constructor(
    private getCustomerService: GetCustomerService,
    private createCustomerService: CreateCustomer,
    private editCustomerService: EditCustomer,
    private deleteCustomerService: DeleteCustomer,
    private editOpeningBalanceService: EditOpeningBalanceCustomer,
    private getCustomersService: GetCustomers,
    private readonly bulkDeleteCustomersService: BulkDeleteCustomersService,
    private readonly validateBulkDeleteCustomersService: ValidateBulkDeleteCustomersService,
  ) {}

  /**
   * Retrieves the given customer details.
   * @param {number} customerId - Customer id.
   */
  public getCustomer = (customerId: number) => {
    return this.getCustomerService.getCustomer(customerId);
  };

  /**
   * Creates a new customer.
   * @param {ICustomerNewDTO} customerDTO - Create customer dto.
   * @returns {Promise<ICustomer>}
   */
  public createCustomer = (customerDTO: CreateCustomerDto) => {
    return this.createCustomerService.createCustomer(customerDTO);
  };

  /**
   * Edits details of the given customer.
   * @param {number} customerId - Customer id.
   * @param {ICustomerEditDTO} customerDTO - Customer edit DTO.
   * @return {Promise<ICustomer>}
   */
  public editCustomer = (customerId: number, customerDTO: EditCustomerDto) => {
    return this.editCustomerService.editCustomer(customerId, customerDTO);
  };

  /**
   * Deletes the given customer and associated transactions.
   * @param {number} customerId - Customer id.
   * @returns {Promise<void>}
   */
  public deleteCustomer = (customerId: number) => {
    return this.deleteCustomerService.deleteCustomer(customerId);
  };

  /**
   * Changes the opening balance of the given customer.
   * @param {number} customerId - Customer id.
   * @param {Date|string} openingBalanceEditDTO - Opening balance edit dto.
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
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  public getCustomers = (filterDTO: GetCustomersQueryDto) => {
    return this.getCustomersService.getCustomersList(filterDTO);
  };

  public bulkDeleteCustomers = (
    customerIds: number[],
    options?: { skipUndeletable?: boolean },
  ) => {
    return this.bulkDeleteCustomersService.bulkDeleteCustomers(
      customerIds,
      options,
    );
  };

  public validateBulkDeleteCustomers = (customerIds: number[]) => {
    return this.validateBulkDeleteCustomersService.validateBulkDeleteCustomers(
      customerIds,
    );
  };
}
