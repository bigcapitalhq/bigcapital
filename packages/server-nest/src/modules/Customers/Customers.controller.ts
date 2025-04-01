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
import { ICustomerOpeningBalanceEditDTO } from './types/Customers.types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/CreateCustomer.dto';
import { EditCustomerDto } from './dtos/EditCustomer.dto';

@Controller('customers')
@ApiTags('customers')
export class CustomersController {
  constructor(private customersApplication: CustomersApplication) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the customer details.' })
  getCustomer(@Param('id') customerId: number) {
    return this.customersApplication.getCustomer(customerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer.' })
  createCustomer(@Body() customerDTO: CreateCustomerDto) {
    return this.customersApplication.createCustomer(customerDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given customer.' })
  editCustomer(
    @Param('id') customerId: number,
    @Body() customerDTO: EditCustomerDto,
  ) {
    return this.customersApplication.editCustomer(customerId, customerDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given customer.' })
  deleteCustomer(@Param('id') customerId: number) {
    return this.customersApplication.deleteCustomer(customerId);
  }

  @Put(':id/opening-balance')
  @ApiOperation({ summary: 'Edit the opening balance of the given customer.' })
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
