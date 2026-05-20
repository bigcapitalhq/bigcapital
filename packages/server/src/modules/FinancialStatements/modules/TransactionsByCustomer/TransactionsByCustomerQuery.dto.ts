import { IsArray, IsOptional } from 'class-validator';
import { TransactionsByContactQueryDto } from '../TransactionsByContact/TransactionsByContactQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingTagAssignmentDto } from '@/modules/TrackingTags/dtos/AssignTrackingTags.dto';

export class TransactionsByCustomerQueryDto extends TransactionsByContactQueryDto {
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
