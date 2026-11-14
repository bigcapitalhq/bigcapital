import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBatchDto {
  @ApiProperty({
    description: 'The id of the inventory item',
    example: 1,
  })
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({
    description: 'The batch number',
    example: 'BATCH-001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  batchNumber: string;

  @ApiProperty({
    description: 'The manufacturer batch reference',
    example: 'MFG-2026-01',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(191)
  batchRef?: string | null;

  @ApiProperty({
    description: 'The manufacturing date',
    example: '2026-01-01',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  manufacturedDate?: Date | string | null;

  @ApiProperty({
    description: 'The expiry date',
    example: '2027-01-01',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date | string | null;

  @ApiProperty({
    description: 'The quantity received in this batch',
    example: 100,
  })
  @ToNumber()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'The transaction type that created the batch',
    example: 'Bill',
    required: false,
  })
  @IsString()
  @IsOptional()
  sourceTransactionType?: string;

  @ApiProperty({
    description: 'The transaction id that created the batch',
    example: 10,
    required: false,
  })
  @ToNumber()
  @IsInt()
  @IsOptional()
  sourceTransactionId?: number;
}
