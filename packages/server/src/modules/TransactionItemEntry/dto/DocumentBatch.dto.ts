import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IDocumentBatch } from '../ItemEntry.types';

export class DocumentBatchDto implements IDocumentBatch {
  @ApiProperty({
    description: 'The ID of the batch',
    example: 1,
  })
  batchId: number;

  @ApiProperty({
    description: 'The batch number',
    example: 'BATCH-001',
  })
  batchNumber: string;

  @ApiPropertyOptional({
    description: 'The batch reference',
    example: 'MFG-2026-01',
    nullable: true,
  })
  batchRef?: string | null;

  @ApiPropertyOptional({
    description: 'The batch expiry date',
    example: '2027-01-01',
    nullable: true,
  })
  expiryDate?: string | null;

  @ApiProperty({
    description: 'The quantity moved from or to the batch',
    example: 5,
  })
  quantity: number;

  @ApiProperty({
    description: 'The ID of the item',
    example: 1,
  })
  itemId: number;

  @ApiProperty({
    description: 'The name of the item',
    example: 'Item 1',
  })
  itemName: string;

  @ApiProperty({
    description: 'The direction of the batch movement',
    enum: ['in', 'out'],
    example: 'out',
  })
  direction: 'in' | 'out';
}
