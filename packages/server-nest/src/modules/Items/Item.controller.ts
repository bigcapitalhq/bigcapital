import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/ZodValidation.pipe';
import { createItemSchema } from './Item.schema';
import { CreateItemService } from './CreateItem.service';
import { Item } from './models/Item';
import { DeleteItemService } from './DeleteItem.service';
import { TenantController } from '../Tenancy/Tenant.controller';
import { SubscriptionGuard } from '../Subscription/interceptors/Subscription.guard';
import { ClsService } from 'nestjs-cls';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('/items')
@UseGuards(SubscriptionGuard)
@PublicRoute()
export class ItemsController extends TenantController {
  constructor(
    private readonly createItemService: CreateItemService,
    private readonly deleteItemService: DeleteItemService,
    private readonly cls: ClsService,
  ) {
    super();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createItemSchema))
  async createItem(@Body() createItemDto: any): Promise<Item> {
    return this.createItemService.createItem(createItemDto);
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.deleteItemService.deleteItem(itemId);
  }
}
