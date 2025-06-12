import { Controller, Get, Query } from '@nestjs/common';
import { GetItemsInventoryValuationListService } from './queries/GetItemsInventoryValuationList.service';
import { GetInventoyItemsCostQueryDto } from './dtos/GetInventoryItemsCostQuery.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('inventory-cost')
@ApiTags('Inventory Cost')
export class InventoryCostController {
  constructor(
    private readonly inventoryItemCost: GetItemsInventoryValuationListService,
  ) {}

  @Get('items')
  @ApiOperation({ summary: 'Get items inventory valuation list' })
  async getItemsCost(
    @Query() itemsCostsQueryDto: GetInventoyItemsCostQueryDto,
  ) {
    const costs = await this.inventoryItemCost.getItemsInventoryValuationList(
      itemsCostsQueryDto.itemsIds,
      itemsCostsQueryDto.date,
    );
    return { costs };
  }
}
