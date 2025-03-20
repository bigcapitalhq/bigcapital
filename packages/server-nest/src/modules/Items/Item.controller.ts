import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Patch,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { TenantController } from '../Tenancy/Tenant.controller';
import { SubscriptionGuard } from '../Subscription/interceptors/Subscription.guard';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ItemsApplicationService } from './ItemsApplication.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IItemsFilter } from './types/Items.types';
import { IItemDTO } from '@/interfaces/Item';
import { CreateItemDto, EditItemDto } from './dtos/Item.dto';

@Controller('/items')
@UseGuards(SubscriptionGuard)
@ApiTags('items')
@PublicRoute()
export class ItemsController extends TenantController {
  constructor(private readonly itemsApplication: ItemsApplicationService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the item list.' })
  @ApiResponse({
    status: 200,
    description: 'The item list has been successfully retrieved.',
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
  async getItems(@Query() filterDTO: IItemsFilter): Promise<any> {
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
  async editItem(
    @Param('id') id: string,
    @Body() editItemDto: EditItemDto,
  ): Promise<number> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.editItem(itemId, editItemDto);
  }

  /**
   * Create item.
   * @param createItemDto - The item DTO.
   * @returns The created item id.
   */
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

  /**
   * Delete item.
   * @param id - The item id.
   */
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

  /**
   * Inactivate item.
   * @param id - The item id.
   */
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

  /**
   * Activate item.
   * @param id - The item id.
   */
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

  /**
   * Get item.
   * @param id - The item id.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully retrieved.',
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

  /**
   * Retrieves the item associated invoices transactions.
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Get(':id/invoices')
  @ApiOperation({
    summary: 'Retrieves the item associated invoices transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated invoices transactions have been successfully retrieved.',
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

  /**
   * Retrieves the item associated bills transactions.
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Get(':id/bills')
  @ApiOperation({
    summary: 'Retrieves the item associated bills transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated bills transactions have been successfully retrieved.',
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

  /**
   * Retrieves the item associated estimates transactions.
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Get(':id/estimates')
  @ApiOperation({
    summary: 'Retrieves the item associated estimates transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated estimate transactions have been successfully retrieved.',
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

  /**
   * Retrieves the item associated receipts transactions.
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Get(':id/receipts')
  @ApiOperation({
    summary: 'Retrieves the item associated receipts transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated receipts transactions have been successfully retrieved.',
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
