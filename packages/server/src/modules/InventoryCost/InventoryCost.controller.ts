import { Controller, Get, Query } from '@nestjs/common';
import { GetItemsInventoryValuationListService } from './queries/GetItemsInventoryValuationList.service';
import { GetInventoyItemsCostQueryDto } from './dtos/GetInventoryItemsCostQuery.dto';
import { GetInventoryItemsCostResponseDto } from './dtos/GetInventoryItemsCostResponse.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequireSubscriptionFeature } from '@/modules/Subscription/decorators/RequireSubscriptionFeature.decorator';
import { SubscriptionFeature } from '@/modules/Subscription/SubscriptionFeatures';

@Controller('inventory-cost')
@ApiTags('Inventory Cost')
@RequireSubscriptionFeature(SubscriptionFeature.Inventory)
@ApiCommonHeaders()
export class InventoryCostController {
  constructor(
    private readonly inventoryItemCost: GetItemsInventoryValuationListService,
  ) {}

  @Get('items')
  @ApiOperation({ summary: 'Get items inventory valuation list' })
  @ApiResponse({
    status: 200,
    description: 'Items inventory cost list',
    type: GetInventoryItemsCostResponseDto,
  })
  async getItemsCost(
    @Query() itemsCostsQueryDto: GetInventoyItemsCostQueryDto,
  ): Promise<GetInventoryItemsCostResponseDto> {
    const costs = await this.inventoryItemCost.getItemsInventoryValuationList(
      itemsCostsQueryDto.itemsIds,
      itemsCostsQueryDto.date,
    );
    return { costs };
  }
}
