import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TrackingTagAssignmentDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Tag ID', example: 1 })
  tagId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ description: 'Option ID', example: 5 })
  optionId?: number;
}

export class AssignTrackingTagsDto {
  @ValidateNested({ each: true })
  @Type(() => TrackingTagAssignmentDto)
  @ApiProperty({ description: 'Tracking tag assignments', type: [TrackingTagAssignmentDto] })
  assignments: TrackingTagAssignmentDto[];
}
