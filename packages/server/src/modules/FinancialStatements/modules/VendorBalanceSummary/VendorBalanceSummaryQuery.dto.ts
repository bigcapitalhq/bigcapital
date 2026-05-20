import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingTagAssignmentDto } from '@/modules/TrackingTags/dtos/AssignTrackingTags.dto';

export class VendorBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of vendor IDs to filter the summary',
    type: [Number],
    example: [1, 2, 3],
  })
  vendorsIds: number[];

  @ApiPropertyOptional({
    description: 'Tracking tags to filter the report',
    type: [TrackingTagAssignmentDto],
  })
  @IsOptional()
  trackingTags?: TrackingTagAssignmentDto[];
}
