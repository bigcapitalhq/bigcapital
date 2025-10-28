import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VendorBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of vendor IDs to filter the summary',
    type: [Number],
    example: [1, 2, 3],
  })
  vendorsIds: number[];
}
