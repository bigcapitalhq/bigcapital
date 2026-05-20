import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingTagAssignmentDto } from '@/modules/TrackingTags/dtos/AssignTrackingTags.dto';

export class CustomerBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @ApiPropertyOptional({
    description: 'Array of customer IDs to filter the summary',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  customersIds: number[];

  @ApiPropertyOptional({
    description: 'Tracking tags to filter the report',
    type: [TrackingTagAssignmentDto],
  })
  @IsOptional()
  trackingTags?: TrackingTagAssignmentDto[];
}
