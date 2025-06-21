import { IsArray, IsOptional } from 'class-validator';
import { TransactionsByContactQueryDto } from '../TransactionsByContact/TransactionsByContactQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionsByVendorQueryDto extends TransactionsByContactQueryDto {
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of vendor IDs to include',
    example: [1, 2, 3],
  })
  vendorsIds: number[];
}
