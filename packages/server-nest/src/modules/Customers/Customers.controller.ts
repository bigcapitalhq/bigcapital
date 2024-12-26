import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomersApplication } from './CustomersApplication.service';
import {
  ICustomerEditDTO,
  ICustomerNewDTO,
  ICustomerOpeningBalanceEditDTO,
} from './types/Customers.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('customers')
@PublicRoute()
export class CustomersController {
  constructor(private customersApplication: CustomersApplication) {}

  @Get(':id')
  getCustomer(@Param('id') customerId: number) {
    return this.customersApplication.getCustomer(customerId);
  }

  @Post()
  createCustomer(@Body() customerDTO: ICustomerNewDTO) {
    return this.customersApplication.createCustomer(customerDTO);
  }

  @Put(':id')
  editCustomer(
    @Param('id') customerId: number,
    @Body() customerDTO: ICustomerEditDTO,
  ) {
    return this.customersApplication.editCustomer(customerId, customerDTO);
  }

  @Delete(':id')
  deleteCustomer(@Param('id') customerId: number) {
    return this.customersApplication.deleteCustomer(customerId);
  }

  @Put(':id/opening-balance')
  editOpeningBalance(
    @Param('id') customerId: number,
    @Body() openingBalanceDTO: ICustomerOpeningBalanceEditDTO,
  ) {
    return this.customersApplication.editOpeningBalance(
      customerId,
      openingBalanceDTO,
    );
  }
}
