import { ApiProperty } from '@nestjs/swagger';
import { ItemLinkDto } from '@/modules/Items/dtos/ItemLink.dto';

export class InventoryAdjustmentEntryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the inventory adjustment entry',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The unique identifier of the inventory adjustment',
    example: 1,
  })
  adjustmentId: number;

  @ApiProperty({
    description: 'The index of the entry',
    example: 1,
  })
  index: number;

  @ApiProperty({
    description: 'The id of the item',
    example: 1,
  })
  itemId: number;

  @ApiProperty({
    description: 'The quantity of the entry',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'The cost of the entry',
    example: 100,
  })
  cost: number;

  @ApiProperty({
    description: 'The value of the entry',
    example: 1000,
  })
  value: number;

  @ApiProperty({
    description: 'The nested item summary',
    type: ItemLinkDto,
    required: false,
  })
  item?: ItemLinkDto;
}
