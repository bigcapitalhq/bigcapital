import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TrackingTagAssignmentDto } from '@/modules/TrackingTags/dtos/AssignTrackingTags.dto';

export class TransactionsByReferenceQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of the reference (e.g., SaleInvoice, Bill, etc.)',
    example: 'SaleInvoice',
    required: true,
  })
  referenceType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the reference',
    example: '1',
    required: true,
  })
  referenceId: number;

  @ApiProperty({
    description: 'Tracking tags to filter the report',
    type: [TrackingTagAssignmentDto],
    required: false,
  })
  @IsOptional()
  trackingTags?: TrackingTagAssignmentDto[];
}
