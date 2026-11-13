import { ApiProperty } from '@nestjs/swagger';
import { BatchStatus } from '../types/Batches.types';

export class BatchResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  batchNumber: string;

  @ApiProperty({ required: false, nullable: true })
  batchRef?: string | null;

  @ApiProperty({ required: false, nullable: true })
  manufacturedDate?: string | null;

  @ApiProperty({ required: false, nullable: true })
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

  @ApiProperty({ required: false })
  item?: {
    id: number;
    name: string;
    code?: string | null;
  };
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
