import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Patch,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { TenantController } from '../Tenancy/Tenant.controller';
import { ItemsApplicationService } from './ItemsApplication.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateItemDto, EditItemDto } from './dtos/Item.dto';
import { GetItemsQueryDto } from './dtos/GetItemsQuery.dto';
import { ItemResponseDto } from './dtos/itemResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ItemInvoiceResponseDto } from './dtos/ItemInvoiceResponse.dto';
import { ItemEstimatesResponseDto } from './dtos/ItemEstimatesResponse.dto';
import { ItemBillsResponseDto } from './dtos/ItemBillsResponse.dto';
import { ItemReceiptsResponseDto } from './dtos/ItemReceiptsResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('/items')
@ApiTags('Items')
@ApiExtraModels(ItemResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(ItemInvoiceResponseDto)
@ApiExtraModels(ItemEstimatesResponseDto)
@ApiExtraModels(ItemBillsResponseDto)
@ApiExtraModels(ItemEstimatesResponseDto)
@ApiExtraModels(ItemReceiptsResponseDto)
@ApiCommonHeaders()
export class ItemsController extends TenantController {
  constructor(private readonly itemsApplication: ItemsApplicationService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the item list.' })
  @ApiResponse({
    status: 200,
    description: 'The item list has been successfully retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ItemResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'customViewId',
    required: false,
    type: Number,
    description: 'Custom view ID for filtering',
  })
  @ApiQuery({
    name: 'filterRoles',
    required: false,
    type: Array,
    description: 'Array of filter roles',
  })
  @ApiQuery({
    name: 'columnSortBy',
    required: false,
    type: String,
    description: 'Column sort direction',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['DESC', 'ASC'],
    description: 'Sort order direction',
  })
  @ApiQuery({
    name: 'stringifiedFilterRoles',
    required: false,
    type: String,
    description: 'Stringified filter roles',
  })
  @ApiQuery({
    name: 'searchKeyword',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'viewSlug',
    required: false,
    type: String,
    description: 'View slug for filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'inactiveMode',
    required: false,
    type: Boolean,
    description: 'Filter for inactive items',
  })
  async getItems(@Query() filterDTO: GetItemsQueryDto): Promise<any> {
    return this.itemsApplication.getItems(filterDTO);
  }

  /**
   * Edit item.
   * @param id - The item id.
   * @param editItemDto - The item DTO.
   * @returns The updated item id.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Edit the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async editItem(
    @Param('id') id: string,
    @Body() editItemDto: EditItemDto,
  ): Promise<number> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.editItem(itemId, editItemDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully created.',
  })
  // @UsePipes(new ZodValidationPipe(createItemSchema))
  async createItem(@Body() createItemDto: CreateItemDto): Promise<number> {
    return this.itemsApplication.createItem(createItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async deleteItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.deleteItem(itemId);
  }

  @Patch(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully inactivated.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async inactivateItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.inactivateItem(itemId);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully activated.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async activateItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.activateItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(ItemResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItem(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItem(itemId);
  }

  @Get(':id/invoices')
  @ApiOperation({
    summary: 'Retrieves the item associated invoices transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated invoices transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemInvoiceResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemInvoicesTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemInvoicesTransactions(itemId);
  }

  @Get(':id/bills')
  @ApiOperation({
    summary: 'Retrieves the item associated bills transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated bills transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemBillsResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemBillTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemBillTransactions(itemId);
  }

  @Get(':id/estimates')
  @ApiOperation({
    summary: 'Retrieves the item associated estimates transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated estimate transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemEstimatesResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemEstimatesTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemEstimatesTransactions(itemId);
  }

  @Get(':id/receipts')
  @ApiOperation({
    summary: 'Retrieves the item associated receipts transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated receipts transactions have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(ItemReceiptsResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemReceiptTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemReceiptsTransactions(itemId);
  }
}
