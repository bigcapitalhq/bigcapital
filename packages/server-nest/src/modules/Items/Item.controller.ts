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
} from '@nestjs/common';
import { TenantController } from '../Tenancy/Tenant.controller';
import { SubscriptionGuard } from '../Subscription/interceptors/Subscription.guard';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ItemsApplicationService } from './ItemsApplication.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/items')
@UseGuards(SubscriptionGuard)
@ApiTags('items')
@PublicRoute()
export class ItemsController extends TenantController {
  constructor(private readonly itemsApplication: ItemsApplicationService) {
    super();
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
  // @UsePipes(new ZodValidationPipe(createItemSchema))
  async editItem(
    @Param('id') id: string,
    @Body() editItemDto: any,
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
  // @UsePipes(new ZodValidationPipe(createItemSchema))
  async createItem(@Body() createItemDto: any): Promise<number> {
    return this.itemsApplication.createItem(createItemDto);
  }

  /**
   * Delete item.
   * @param id - The item id.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given item (product or service).' })
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
  async inactivateItem(@Param('id') id: string): Promise<void> {
    console.log(id, 'XXXXXX');

    const itemId = parseInt(id, 10);
    return this.itemsApplication.inactivateItem(itemId);
  }

  /**
   * Activate item.
   * @param id - The item id.
   */
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate the given item (product or service).' })
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
  @ApiOperation({ summary: 'Retrieves the item associated invoices transactions.' })
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
  @ApiOperation({ summary: 'Retrieves the item associated bills transactions.' })
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
  @ApiOperation({ summary: 'Retrieves the item associated estimates transactions.' })
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
  @ApiOperation({ summary: 'Retrieves the item associated receipts transactions.' })
  async getItemReceiptTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemReceiptsTransactions(itemId);
  }
}
