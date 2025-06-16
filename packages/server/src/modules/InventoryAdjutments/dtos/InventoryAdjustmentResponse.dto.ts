import { ApiProperty } from '@nestjs/swagger';
import { InventoryAdjustmentEntry } from '../models/InventoryAdjustmentEntry';

export class InventoryAdjustmentResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the inventory adjustment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date of the inventory adjustment',
    example: '2024-03-20',
  })
  date: string;

  @ApiProperty({
    description: 'The type of adjustment (increment or decrement)',
    enum: ['increment', 'decrement'],
    example: 'increment',
  })
  type: string;

  @ApiProperty({
    description: 'The formatted type of adjustment',
    example: 'inventory_adjustment.increment',
  })
  formattedType: string;

  @ApiProperty({
    description: 'The ID of the adjustment account',
    example: 100,
  })
  adjustmentAccountId: number;

  @ApiProperty({
    description: 'The reason for the adjustment',
    example: 'Stock count discrepancy',
  })
  reason: string;

  @ApiProperty({
    description: 'The reference number for the adjustment',
    example: 'IA-2024-001',
  })
  referenceNo: string;

  @ApiProperty({
    description: 'Additional description of the adjustment',
    example: 'Year-end inventory reconciliation',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The ID of the user who created the adjustment',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'The date when the adjustment was published',
    example: '2024-03-20T10:00:00Z',
    required: false,
  })
  publishedAt?: string;

  @ApiProperty({
    description: 'The ID of the branch where the adjustment was made',
    example: 1,
  })
  branchId: number;

  @ApiProperty({
    description: 'The ID of the warehouse where the adjustment was made',
    example: 1,
  })
  warehouseId: number;

  @ApiProperty({
    description: 'The date when the adjustment was created',
    example: '2024-03-20T09:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The entries associated with this adjustment',
    type: [InventoryAdjustmentEntry],
    isArray: true,
  })
  entries: InventoryAdjustmentEntry[];
}
