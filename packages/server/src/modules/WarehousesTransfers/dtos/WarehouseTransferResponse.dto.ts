import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class WarehouseTransferEntryResponseDto {
  @ApiProperty({
    description: 'The ID of the warehouse transfer entry',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the item being transferred',
    example: 1,
  })
  itemId: number;

  @ApiProperty({
    description: 'The quantity of items being transferred',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'The cost per unit of the item',
    example: 10.5,
  })
  cost: number;

  @ApiProperty({
    description: 'The total cost of the transfer entry',
    example: 1050.0,
  })
  total: number;

  @ApiProperty({
    description: 'The formatted quantity of items being transferred',
    example: '100.00',
  })
  formattedQuantity: string;

  @ApiProperty({
    description: 'The formatted cost per unit of the item',
    example: '$10.50',
  })
  formattedCost: string;

  @ApiProperty({
    description: 'The formatted total cost of the transfer entry',
    example: '$1,050.00',
  })
  formattedTotal: string;

  @ApiProperty({
    description: 'The item details',
    type: 'object',
  })
  item: any;
}

export class WarehouseTransferResponseDto {
  @ApiProperty({
    description: 'The ID of the warehouse transfer',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date of the warehouse transfer',
    example: '2024-03-20',
  })
  date: Date;

  @ApiProperty({
    description: 'The formatted date of the warehouse transfer',
    example: 'Mar 20, 2024',
  })
  formattedDate: string;

  @ApiProperty({
    description: 'The transaction number of the warehouse transfer',
    example: 'WT-2024-001',
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'The ID of the source warehouse',
    example: 1,
  })
  fromWarehouseId: number;

  @ApiProperty({
    description: 'The ID of the destination warehouse',
    example: 2,
  })
  toWarehouseId: number;

  @ApiProperty({
    description: 'The date when the transfer was initiated',
    example: '2024-03-20T10:00:00Z',
  })
  transferInitiatedAt: Date;

  @ApiProperty({
    description: 'The date when the transfer was delivered',
    example: '2024-03-21T15:00:00Z',
  })
  transferDeliveredAt: Date;

  @ApiProperty({
    description: 'Whether the transfer has been initiated',
    example: true,
  })
  isInitiated: boolean;

  @ApiProperty({
    description: 'Whether the transfer has been completed',
    example: true,
  })
  isTransferred: boolean;

  @ApiProperty({
    description: 'The source warehouse details',
    type: 'object',
  })
  fromWarehouse: any;

  @ApiProperty({
    description: 'The destination warehouse details',
    type: 'object',
  })
  toWarehouse: any;

  @ApiProperty({
    description: 'The entries of the warehouse transfer',
    type: [WarehouseTransferEntryResponseDto],
  })
  @Type(() => WarehouseTransferEntryResponseDto)
  entries: WarehouseTransferEntryResponseDto[];

  @ApiProperty({
    description: 'The creation date of the warehouse transfer',
    example: '2024-03-20T09:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the warehouse transfer',
    example: '2024-03-21T15:00:00Z',
  })
  updatedAt: Date;
}
