import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BulkSaveBatchItemDto {
  @ApiPropertyOptional({
    description:
      'The id of an existing batch to update. Omit it to create a new batch.',
    example: 1,
  })
  @ToNumber()
  @IsInt()
  @IsOptional()
  batchId?: number;

  @ApiProperty({
    description: 'The batch number',
    example: 'BATCH-001',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  batchNumber: string;

  @ApiPropertyOptional({
    description: 'The manufacturer batch reference',
    example: 'MFG-2026-01',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(191)
  batchRef?: string | null;

  @ApiPropertyOptional({
    description: 'The manufacturing date',
    example: '2026-01-01',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  manufacturedDate?: Date | string | null;

  @ApiPropertyOptional({
    description: 'The expiry date',
    example: '2027-01-01',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date | string | null;

  @ApiPropertyOptional({
    description: 'The quantity received in this batch',
    example: 100,
  })
  @ToNumber()
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({
    description: 'The transaction type that created the batch',
    example: 'Bill',
  })
  @IsString()
  @IsOptional()
  sourceTransactionType?: string;

  @ApiPropertyOptional({
    description: 'The transaction id that created the batch',
    example: 10,
  })
  @ToNumber()
  @IsInt()
  @IsOptional()
  sourceTransactionId?: number;
}

export class BulkSaveBatchesDto {
  @ApiProperty({
    description: 'The id of the inventory item',
    example: 1,
  })
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({
    description: 'The batches to create or update',
    type: [BulkSaveBatchItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BulkSaveBatchItemDto)
  batches: BulkSaveBatchItemDto[];
}
