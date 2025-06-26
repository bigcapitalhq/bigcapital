import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomersApplication } from './CustomersApplication.service';
import {
  ICustomerOpeningBalanceEditDTO,
  ICustomersFilter,
} from './types/Customers.types';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/CreateCustomer.dto';
import { EditCustomerDto } from './dtos/EditCustomer.dto';
import { CustomerResponseDto } from './dtos/CustomerResponse.dto';
import { GetCustomersQueryDto } from './dtos/GetCustomersQuery.dto';

@Controller('customers')
@ApiTags('Customers')
@ApiExtraModels(CustomerResponseDto)
export class CustomersController {
  constructor(private customersApplication: CustomersApplication) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the customer details.' })
  @ApiResponse({
    status: 200,
    description: 'The customer details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(CustomerResponseDto) },
  })
  getCustomer(@Param('id') customerId: number) {
    return this.customersApplication.getCustomer(customerId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the customers paginated list.' })
  @ApiResponse({
    status: 200,
    description: 'The customers have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CustomerResponseDto) },
    },
  })
  getCustomers(@Query() filterDTO: GetCustomersQueryDto) {
    return this.customersApplication.getCustomers(filterDTO);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer.' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
    schema: { $ref: getSchemaPath(CustomerResponseDto) },
  })
  createCustomer(@Body() customerDTO: CreateCustomerDto) {
    return this.customersApplication.createCustomer(customerDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given customer.' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomerResponseDto) },
  })
  editCustomer(
    @Param('id') customerId: number,
    @Body() customerDTO: EditCustomerDto,
  ) {
    return this.customersApplication.editCustomer(customerId, customerDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given customer.' })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully deleted.',
  })
  deleteCustomer(@Param('id') customerId: number) {
    return this.customersApplication.deleteCustomer(customerId);
  }

  @Put(':id/opening-balance')
  @ApiOperation({ summary: 'Edit the opening balance of the given customer.' })
  @ApiResponse({
    status: 200,
    description: 'The customer opening balance has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomerResponseDto) },
  })
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
