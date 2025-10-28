import { IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetPendingTransactionsQueryDto {
  @IsOptional()
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1
  })
  page?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 10
  })
  pageSize?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Filter by bank account ID',
    required: false,
    type: Number,
    example: 1
  })
  accountId?: number;
}
