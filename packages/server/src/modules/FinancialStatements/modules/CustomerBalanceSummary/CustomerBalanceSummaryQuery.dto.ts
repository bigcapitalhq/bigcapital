import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @ApiPropertyOptional({
    description: 'Array of customer IDs to filter the summary',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  customersIds: number[];
}
