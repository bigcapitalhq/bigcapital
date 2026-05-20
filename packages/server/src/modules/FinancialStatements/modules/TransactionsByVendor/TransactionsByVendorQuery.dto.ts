import { IsArray, IsOptional } from 'class-validator';
import { TransactionsByContactQueryDto } from '../TransactionsByContact/TransactionsByContactQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingTagAssignmentDto } from '@/modules/TrackingTags/dtos/AssignTrackingTags.dto';

export class TransactionsByVendorQueryDto extends TransactionsByContactQueryDto {
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of vendor IDs to include',
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
