import { ApiProperty } from '@nestjs/swagger';

export class ItemWarehousesResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the warehouse.',
  })
  warehouseId: number;

  @ApiProperty({
    example: 'Main Warehouse',
    description: 'The name of the warehouse.',
  })
  warehouseName: string;

  @ApiProperty({
    example: 'WH-001',
    description: 'The code of the warehouse.',
  })
  warehouseCode: string;

  @ApiProperty({
    example: 150,
    description: 'The quantity on hand of the item in the warehouse.',
  })
  quantityOnHand: number;

  @ApiProperty({
    example: '150',
    description: 'The formatted quantity on hand of the item in the warehouse.',
  })
  quantityOnHandFormatted: string;

  @ApiProperty({
    example: 150,
    description: 'The quantity available for sale in the warehouse.',
  })
  availableForSale: number;
}
