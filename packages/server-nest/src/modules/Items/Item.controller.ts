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

@Controller('/items')
@UseGuards(SubscriptionGuard)
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
  // @UsePipes(new ZodValidationPipe(createItemSchema))
  async createItem(@Body() createItemDto: any): Promise<number> {
    return this.itemsApplication.createItem(createItemDto);
  }

  /**
   * Delete item.
   * @param id - The item id.
   */
  @Delete(':id')
  async deleteItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.deleteItem(itemId);
  }

  /**
   * Inactivate item.
   * @param id - The item id.
   */
  @Patch(':id/inactivate')
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
  async activateItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.activateItem(itemId);
  }

  /**
   * Get item.
   * @param id - The item id.
   */
  @Get(':id')
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
  async getItemReceiptTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemReceiptsTransactions(itemId);
  }
}
