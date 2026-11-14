import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BatchStatus } from '../types/Batches.types';

export class BatchItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  code?: string | null;

  @ApiPropertyOptional({ type: String })
  type?: string;
}

export class BatchResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  batchNumber: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  batchRef?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  manufacturedDate?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  expiryDate?: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantityIn: number;

  @ApiProperty()
  quantityOut: number;

  @ApiProperty()
  quantityOnHand: number;

  @ApiProperty({ enum: BatchStatus })
  status: BatchStatus;

  @ApiPropertyOptional({ type: String, nullable: true })
  sourceTransactionType?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  sourceTransactionId?: number | null;

  @ApiPropertyOptional({ type: String })
  createdAt?: string;

  @ApiPropertyOptional({ type: String })
  updatedAt?: string;

  @ApiPropertyOptional({ type: BatchItemResponseDto })
  item?: BatchItemResponseDto;
}

export class BatchesListResponseDto {
  @ApiProperty({ type: [BatchResponseDto] })
  results: BatchResponseDto[];

  @ApiProperty()
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}
